// TurrisNotes View JS

var View = function() {
	var v = this;

	this.page = {
		calls: {
			init: function() {
				var $list_container = $( ".page.calls .calls-list" );
				$list_container.text( "" );
				var calls = model.calls;
				if ( calls.length ) {
					for ( var i=0; i<calls.length; i++ ) {
						var node = v.utils.elfactory({
							tag: "h3",
							attrs: [
								{ key: "class", val: "call-title" },
								{ key: "data-id", val: calls[i].id }
							],
							text: calls[i].title
						});
						$list_container.append( node );
					}
				}
			}
		},
		edit_call: {
			call_id: 0,
			init: function( options ) {
				var action = options.action
					, id = options.id;
				v.page.edit_call.call_id = id;
				if ( action === "new call" ) {
					// new call specific actions
				} else if ( action === "edit call" ) {
					console.log( v.page.edit_call.call_id );
				}
			}
		},
		render_word_list: function() {
			var $list_container = $( ".page.edit-call .words-list" );
			$list_container.text( "" );
			var id = v.page.edit_call.call_id
				, call = v.utils.get_call( id )
				, words = call.words;
			if ( words.length > 0 ) {
				for ( var i=0; i<words.length; i++ ) {
					var word = v.utils.get_word( words[i] )
						, node = v.utils.elfactory({
							tag: "div",
							attrs: [
								{ key: "class", val: "word" },
								{ key: "data-id", val: word.id }
							]
						}), span1 = v.utils.elfactory({
							tag: "span",
							attrs: [
								{ key: "class", val: "enoA" }
							],
							text: word.enoA
						}), span2 = v.utils.elfactory({
							tag: "span",
							attrs: [
								{ key: "class", val: "enoB" }
							],
							text: word.enoB
						}), span3 = v.utils.elfactory({
							tag: "span",
							attrs: [
								{ key: "class", val: "eng" }
							],
							text: word.eng
						}), btn1 = v.utils.elfactory({
							tag: "div",
							attrs: [
								{ key: "class", val: "btn edit-word" },
								{ key: "data-id", val: word.id }
							],
							text: "edit"
						}), btn2 = v.utils.elfactory({
							tag: "div",
							attrs: [
								{ key: "class", val: "btn delete-word" },
								{ key: "data-id", val: word.id }
							],
							text: "delete"
						});
					$list_container.append( node );
					$( node ).append( span1 )
						.append( span2 )
						.append( span3 )
						.append( btn1 )
						.append( btn2 );
				}
			}
		},
		poll: {
			intv: false,
			polling: false,
			init: function( options ) {
				var func = options.func || false
					, freq = options.freq || 500
					, callback = options.callback || false;
				if ( typeof func === "function" ) {
					this.polling = true;
					this.intv = setInterval( function() {
						func();
						if ( !this.polling ) {
							clearInterval( v.page.poll.intv );
							if ( typeof callback === "function" ) { callback(); }
						}
					}, freq );
				}
			}
		},
		go_to: function( options ) {
			var to = options.to
				, from = options.from
				, direction = options.direction
				, to_class = ( direction === "left" )? "off-right" : "off-left"
				, from_class = ( direction === "left" )? "off-left" : "off-right"
				, $both = $( [ to, ",", from ].join( "" ) );
			$both.removeClass( "animate" );
			$( to ).addClass( to_class ).removeClass( from_class );
			setTimeout( function() {
				$both.addClass( "animate" );
				$( to ).removeClass( to_class );
				$( from ).addClass( from_class );
			}, 100 );
		}
	}

	this.utils = {
		elfactory: function( options ) {
			var tag = options.tag || false
				, attrs = options.attrs || false
				, text = options.text || false;
			if ( !tag ) { return false; }
			var el = document.createElement( tag );
			if ( attrs ) {
				for ( var i=0; i<attrs.length; i++ ) {
					var key = attrs[i].key
						, val = attrs[i].val;
					el.setAttribute( key, val );
				}
			}
			if ( text ) { el.innerHTML = text; }
			return el;
		},
		get_word: function( id ) {
			var id = id
				, word;
			for ( var i=0; i<model.words.length; i++ ) {
				if ( model.words[i].id == id ) {
					word = model.words[i];
					break;
				}
			}
			return word;
		},
		get_call: function( id ) {
			var id = id
				, call;
			for ( var i=0; i<model.calls.length; i++ ) {
				if ( model.calls[i].id == id ) {
					call = model.calls[i];
					break;
				}
			}
			return call;
		}
	}
}