// TurrisNotes Controller JS

var Controller = function() {
	var c = this;

	this.init = function() {
		c.ls.update_cache();
		c.ls.update_model();
		c.page.calls.init();
	}

	this.page = {
		calls: {
			init: function() {
				view.page.calls.init();
				view.page.poll.init({
					func: function() {
						var call_btns = $( ".page.calls h3.call-title" );
						if ( call_btns === model.calls.length ) {
							view.page.poll.polling = false;
						}
					},
					freq: 200,
					callback: function() {
						var call_btns = $( ".page.calls h3.call-title" );
						// bind new call btn
						$( ".page.calls .btn.new-call" ).unbind().on( "click touchstart", function( e ) {
							view.page.go_to({
								to: ".page.edit-call",
								from: ".page.calls",
								direction: "left"
							});
							c.page.calls.unbind();
							c.page.new_call.init();
						});
						// bind call list btns
						for ( var i=0; i<call_btns.length; i++ ) {
							$( call_btns[i] ).on( "click touchstart", function( e ) {
								view.page.go_to({
									to: ".page.edit-call",
									from: ".page.calls",
									direction: "left"
								});
								c.page.calls.unbind();
								console.log( $( e.target ).attr( "data-id" ) );
								c.page.edit_call.init({ id: $( e.target ).attr( "data-id" ) });
							});
						}
					}
				});
			},
			unbind: function() {
				$( ".page.calls h3, .page.calls .btn" ).unbind();
			}
		},
		new_call: {
			init: function() {
				if ( model.last_call === undefined ) {
					model.last_call = 0;
				} else {
					model.last_call += 1;
				}
				c.ls.update_last_call( model.last_call );
				var call = { id: model.last_call, title: "New Call", words: [] }
					, id = call.id;
				c.ls.add_call( call );
				view.page.edit_call.init({
					action: "new call",
					id: id
				});
				c.page.new_call.unbind();
				$( ".page.edit-call .btn.add-word" ).on( "click touchstart", function( e ) {
					model.last_word += 1;
					c.ls.update_last_word( model.last_word );
					var word = {
						id: model.last_word,
						enoA: $( ".page.edit-call input#enoA" ).val(),
						enoB: $( ".page.edit-call input#enoB" ).val(),
						eng: $( ".page.edit-call input#eng" ).val()
					}, call = view.utils.get_call( id );
					call.title = $( ".page.edit-call input#call-title" ).val() || "New Call";
					c.page.add_word({ word: word, call: call });
					c.page.render_word_list();
				});
			},
			unbind: function() {
				$( ".page.edit-call .btn.add-word" ).unbind();
			}
		},
		edit_call: {
			init: function( options ) {
				var id = options.id
				view.page.edit_call.init({
					action: "edit call",
					id: id
				});
				c.page.render_word_list();
			},
		},
		render_word_list: function() {
			view.page.render_word_list();
			view.page.poll.init({
				func: function() {
					console.log( "poll" );
					var word_nodes = $( ".page.edit-call .words-list .word" )
						, call = view.utils.get_call( view.page.edit_call.call_id );
					if ( word_nodes.length === call.words.length ) {
						view.page.poll.polling = false; // cancel page poll
					}
				},
				freq: 200,
				callback: function() {
					console.log( "word list done" );
				}
			});
		},
		add_word: function( options ) {
			var word = options.word
				, call = options.call
				, match = false;
			for ( var i=0; i<model.words.length; i++ ) {
				if ( model.words[i].enoA == word.enoA && model.words[i].enoB == word.enoB && model.words[i].eng == word.eng ) {
					match = model.words[i];
					break;
				}
			}
			for ( var i=0; i<c.ls.cache.length; i++ ) {
				if ( c.ls.cache[i].enoA == word.enoA && c.ls.cache[i].enoB == word.enoB && c.ls.cache[i].eng == word.eng ) {
					match = c.ls.cache[i];
					break;
				}
			}
			if ( !match ) {
				c.ls.add_word( word );
				call.words.push( word.id );
			} else {
				call.words.push( match.id );
			}
			c.ls.edit_call( call );
		}
	}

	this.ls = {
		cache: [],
		update_cache: function() {
			c.ls.cache = JSON.parse( window.localStorage.getItem( "turrisModel" ) ) || [];
			console.log( "update_cache", c.ls.cache );
		},
		update_ls: function() {
			window.localStorage.setItem( "turrisModel", JSON.stringify( c.ls.cache ) );
			console.log( "update_ls", window.localStorage.getItem( "turrisModel" ) );
		},
		update_model: function() {
			model = new Model();
			c.ls.update_cache();
			var ls = c.ls.cache;
			if ( ls != null ) {
				for ( var i=0; i<ls.length; i++ ) {
					switch ( ls[i].action ) {
						case "new word":
							var word = {
								id: ls[i].id,
								enoA: ls[i].enoA,
								enoB: ls[i].enoB,
								eng: ls[i].eng
							};
							model.words.push( word );
							break;
						case "edit word":
							break;
						case "delete word":
							break;
						case "new call":
							var call = {
								id: ls[i].id,
								title: ls[i].title,
								words: ls[i].words
							};
							model.calls.push( call );
							break;
						case "edit call":
							var call = {
								id: ls[i].id,
								title: ls[i].title,
								words: ls[i].words
							}
							for ( var j=0; j<model.calls.length; j++ ) {
								if ( model.calls[j].id == ls[i].id ) {
									model.calls[j] = call;
								}
							}
							break;
						case "delete call":
							break;
					}
				}
			}
			var last_call = window.localStorage.getItem( "turrisCalls" )
				, last_word = window.localStorage.getItem( "turrisWords" );

			if ( last_call !== null ) {
				model.last_call = Number( last_call );
			}
			if ( last_word !== null ) {
				model.last_word = Number( last_word );
			}

			console.log( "update_model", model );
		},
		add_word: function( word ) {
			c.ls.update_cache();
			var word = word;
			word.action = "new word";
			c.ls.cache.push( word );
			c.ls.update_ls();
			c.ls.update_model();
		},
		add_call: function( call ) {
			c.ls.update_cache();
			var call = call;
			call.action = "new call";
			c.ls.cache.push( call );
			c.ls.update_ls();
			c.ls.update_model();
		},
		edit_call: function( call ) {
			c.ls.update_cache();
			var call = call;
			call.action = "edit call";
			c.ls.cache.push( call );
			c.ls.update_ls();
			c.ls.update_model();
		},
		update_last_call: function( num ) {
			window.localStorage.setItem( "turrisCalls", num );
		},
		update_last_word: function( num ) {
			window.localStorage.setItem( "turrisWords", num );
		}
	}
}