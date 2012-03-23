(function() {

	var elems = 'h1,h2,h3,h4,h5,h6,p,img',
		root = '#for-review',
		focus = null,
		context = '',
		store = [];

	function to_path(chain) {
		return chain.map(function(x) {
			return '[' + $(x).index() + ':' + x.localName + ':' + x.id + ']';
		}).join();
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

	function save_comment(evt) {
		var el = $(evt.currentTarget);
		var body = $('#comments .comment-body').text();
		var target = focus;
		var chain = target.parentsUntil('section').andSelf().toArray();
		var path = to_path(chain.slice(1));
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
			regarding: target.text(),
			path: path,
			body: body
		};

		//todo: remove the comment so it won't duplicate
		// when editing
		$.post('/comment/' + context, comment, function(data, textStatus, jqXHR) {
			console.log(textStatus);
			comment.author_login = pundit.user.login;
			comment.when = new Date();
			comment.author_gravatar_id = pundit.user.gravatar_id;

			store.push(comment);
			target.addClass('has-comments');
			btn.removeAttr('disabled');
			status.text('comment saved').fadeIn('fast').delay(3000).fadeOut('slow');
		});
	}

	function matching(path) {
		return store.filter(function(x) {
			return x.path === path;
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
		var path = target.data('path');
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
		var set = matching(path);
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

	function mark_document_elements() {

		$(root).find(elems).each(function() {
			var el = $(this);

			var chain = el.parentsUntil('section').andSelf().toArray();
			var path = to_path(chain.slice(1));

			el.attr('data-path', path);

			var content = (this.nodeName === 'IMG') ? this.src : this.innerText;
			content = content.toLowerCase().replace(/[^a-z0-9]+/g, '');
			el.data('hash', md5(content));
		});
	}

	function associate_existing_comments() {

		$('#comments .comments-stats').text(store.length + ' total comment(s)');

		store.forEach(function(x) {
			var selector = '[data-path="' + x.path + '"]';
			$(selector).addClass('has-comments');
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

			var article = $(root);

			article.html(data.content);

			article.find(elems).click(function() {
				var target = $(this);
				set_focus(target);
			});

			article.find(elems).hover(function() {
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
	});

})();
