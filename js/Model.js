// TurrisNotes Model JS

var Model = function() {
	this.words = [
		{
			id: 0,
			enoA: "OL",
			enoB: "Ol",
			eng: "I"
		},{
			id: 1,
			enoA: "SONF",
			enoB: "sonf",
			eng: "reign"
		}
	];
	this.calls = [
		{
			id: 0,
			title: "Test Call",
			words: [ 0, 1 ]
		}
	];
	this.last_word = 1;
	this.last_call = 0;
}