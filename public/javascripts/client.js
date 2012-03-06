(function() {

	var elems = 'h1,h2,h3,h4,h5,h6,p',
		root = '#for-review',
		focus = null,
		context = '',
		store = [];

	function to_path(chain) {
		return chain.map(function(x) {
			return '[' + $(x).index() + ':' + x.localName + ':' + x.id + ']';
		}).join();
	}

	function save_comment(evt) {
		var el = $(evt.currentTarget);
		var body = $('#comments .comment-body').text();
		var target = focus;
		var chain = target.parentsUntil('section').andSelf().toArray();
		var path = to_path(chain.slice(1));

		if (!body || body === '') {
			// todo: check to see if the comment was modified
			// perhaps by setting a flag when we copy content
			// into the edit field
			return;
		}

		var comment = {
			regarding: target.text(),
			path: path,
			body: body
		};

		//todo: remove the comment so it won't duplicate
		// when editing

		$.post('/comment/' + context, comment, function(data, textStatus, jqXHR) {
			console.log(textStatus);
			comment.author = {
				login: login
			};
			store.push(comment);
			target.addClass('has-comments');
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

		history.empty();

		if (focus) {
			focus.removeClass('focus');
		}

		focus = null;

		body.attr('contenteditable', 'false').text('');
		btn.attr('disabled', 'disabled');
	}

	function set_focus(target, chain) {
		var path = target.data('path');
		var history = $('#comments .history');
		var body = $('#comments .comment-body');
		var now = Date.now();
		var btn = $('#save');

		$('#view-all').show();

		history.empty();

		if (focus) {
			focus.removeClass('focus');
		}
		target.addClass('focus');
		focus = target;

		body.attr('contenteditable', 'true').text('').focus();
		btn.removeAttr('disabled', 'disabled');


		var template = $('#tmpl-comment').html();
		var set = matching(path);
		set.forEach(function(x) {
			x.timestampFormatted = function() {
				return how_long_since(x.timestamp, now);
			};

			if (x.author.login === login) {
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
				return how_long_since(x.timestamp, now);
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
		var el = $('#docs');

		documents.forEach(function(doc) {
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

		var target = window.location.href.match(/\/#?([\w-]*\.html)/);
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

		$.getJSON('/documents', setup_document_list);

		// $('#comments .comment-body').blur(save_comment);
		$('#save').click(save_comment);

		document_has_changed();
	});

})();
