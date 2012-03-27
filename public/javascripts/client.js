(function() {

	var $elems, elems = 'h1,h2,h3,h4,h5,h6,p,.img,li',
		$root, root = '#for-review',
		focus = null,
		context = '',
		store = [];

	function get_elements() {
		return $root.find(elems).filter(function(idx, el) {
			return $(el).children(elems).length === 0;
		});
	}

	function handle_comment(evt) {
		var el = $(evt.currentTarget);
		var comment = el.parents('.comment');
		var hash = comment.data('comment-id');
		el.attr('disabled', 'disabled');

		$.post('/comment/handle/' + context + '/' + hash, {}, function(data, textStatus, jqXHR) {
			console.log(textStatus);
			comment.addClass('handled');
			el.remove();
		});
	}

	function delete_comment(evt) {
		var el = $(evt.currentTarget);
		var comment = el.parents('.comment');
		var hash = comment.data('comment-id');

		if (!confirm('Are you sure?')) return;

		el.attr('disabled', 'disabled');

		$.post('/comment/delete/' + context + '/' + hash, {}, function(data, textStatus, jqXHR) {
			console.log(textStatus);
			comment.remove();
		});
	}

	function save_comment(evt) {
		var el = $(evt.currentTarget);
		var body = $('#comments .comment-body').text();
		var target = focus;
		var hash = target.data('hash');
		var btn = $('#save');
		var status = $('#comment-status');

		btn.attr('disabled', 'disabled');

		if (!body || body === '') {
			// todo: check to see if the comment was modified
			// perhaps by setting a flag when we copy content
			// into the edit field
			return;
		}

		var comment = {
			hash: hash,
			regarding: get_regarding_text(target),
			body: body
		};

		//todo: remove the comment so it won't duplicate
		// when editing
		$.post('/comment/' + context, comment, function(data, textStatus, jqXHR) {
			console.log(textStatus);
			comment.author_name = pundit.user.username;
			comment.when = new Date();
			comment.author_avatar_url = pundit.user.__pundit_avatar_url__;

			store.push(comment);
			target.addClass('has-comments');
			btn.removeAttr('disabled');
			status.text('comment saved').fadeIn('fast').delay(3000).fadeOut('slow');
		});
	}

	function matching(hash) {
		return store.filter(function(x) {
			return x.hash === hash;
		});
	}

	function how_long_since(time, now) {
		var delta = now - time;
		var s = 1000;
		var m = s * 60;
		var h = m * 60;
		var d = h * 24;
		var w = d * 7;

		if (delta <= m) return 'just now';
		if (delta <= h) return Math.floor(delta / m) + 'm ago';
		if (delta <= d) return Math.floor(delta / h) + 'h ago';
		if (delta <= w) return Math.floor(delta / d) + 'days ago';
		return Math.floor(delta / w) + 'weeks ago';
	}

	function reset_comment_edits() {
		var history = $('#comments .history');
		var body = $('#comments .comment-body');
		var btn = $('#save');
		var editor = $('#comment-editor');
		var status = $('#comment-status');

		history.empty();

		if (focus) {
			focus.removeClass('focus');
		}

		focus = null;

		body.attr('contenteditable', 'false').text('');
		btn.attr('disabled', 'disabled');
		editor.hide('fast');
		status.text('');
	}

	function set_focus(target, chain) {
		var hash = target.data('hash');
		var history = $('#comments .history');
		var body = $('#comments .comment-body');
		var editor = $('#comment-editor');
		var now = Date.now();
		var btn = $('#save');
		var status = $('#comment-status');

		$('#view-all').show();
		status.text('');

		history.empty();

		if (focus) {
			focus.removeClass('focus');
		}
		target.addClass('focus');
		focus = target;

		body.attr('contenteditable', 'true').text('').focus();
		btn.removeAttr('disabled', 'disabled');
		editor.show('fast');

		var template = $('#tmpl-comment').html();
		var set = matching(hash);
		set.forEach(function(x) {
			x.timestampFormatted = function() {
				return how_long_since(x.when, now);
			};

			if (x.author_login === pundit.user.login) {
				body.text(x.body);
			} else {
				var out = Mustache.render(template, x);
				history.append(out);
			}
		});

		$('#comments .comments-stats').text(set.length + ' comment(s) for selection');
	}

	function render_comments() {
		var template = $('#tmpl-comment').html();
		var history = $('#comments .history');
		var body = $('#comments .comment-body');
		var now = Date.now();

		store.forEach(function(x) {
			x.timestampFormatted = function() {
				return how_long_since(x.when, now);
			};

			var out = Mustache.render(template, x);
			history.append(out);
		});
	}


	function get_regarding_text(el) {
		return el.is('.img') ? el.find('img').attr('src') : el.text().toLowerCase().replace(/[^a-z0-9]+/g, '');
	}

	function hash_content(el) {
		var content = get_regarding_text(el);
		return md5(content);
	}

	function mark_document_elements() {

		$elems.each(function() {
			var el = $(this);
			el.attr('data-hash', hash_content(el));
		});
	}

	function associate_existing_comments() {

		$('#comments .comments-stats').text(store.length + ' total comment(s)');

		store.forEach(function(x) {
			var selector = '[data-hash="' + x.hash + '"]';
			var el = $(selector);
			var count = parseInt((el.attr('data-count') || 0), 10);
			el.addClass('has-comments');
			el.attr('data-count', 1 + count);
		});
	}

	function make_array(obj) {
		var a = [],
			prop;

		for (prop in obj) {
			a.push(obj[prop]);
		}

		return a;
	}

	function setup_document_list(documents) {
		var el = $('#docs select');

		documents.sort().forEach(function(doc) {
			el.append('<option>' + doc + '</option>');
		});

		el.change(function() {

			el.find('option:selected').each(function() {
				var file = $(this).text();
				History.pushState(null, null, file);
			});

			el.find('option[data-default]').remove();

		});
	}

	function document_has_changed() {

		set_context_from_url();

		$('#view-all').hide();
		$('#view-all').click(function() {
			$('#view-all').hide();
			reset_comment_edits();
			render_comments();
			$('#comments .comments-stats').text(store.length + ' total comment(s)');
		});

		if (!context) return;

		$.getJSON('/document/' + context, function(data) {

			$root.html(data.content);
			//wrap all img tags in a div
			$root.find('img').wrap('<div class="img"></div>');
			$elems = get_elements();

			$elems.click(function() {
				var target = $(this);
				set_focus(target);
			});

			$elems.hover(function() {
				$(this).addClass('highlight');
			}, function() {
				$(this).removeClass('highlight');
			});

			reset_comment_edits();

			$.getJSON('/comments/' + context, function(data) {
				store = make_array(data);
				mark_document_elements();
				associate_existing_comments();
				render_comments();
			});
		});
	}

	function set_context_from_url() {

		context = null;

		var target = window.location.href.match(/\/#?([\w-]*\.doc)/);
		if (target !== null && target.length > 0) context = target[1];

		if (!context) {
			History.replaceState(null, null, '/');
			$('#workspace').hide();
		} else {
			$('#workspace').show();
		}
	}

	$(function() {

		$root = $(root);

		History.Adapter.bind(window, 'statechange', function() {
			document_has_changed();
		});

		$.ajaxSetup({
			cache: false
		});

		$.getJSON('/documents', setup_document_list);

		// $('#comments .comment-body').blur(save_comment);
		$('#save').click(save_comment);

		document_has_changed();

		$(document).on('click', '.comment button.handle', handle_comment);
		$(document).on('click', '.comment button.delete', delete_comment);
	});

})();
