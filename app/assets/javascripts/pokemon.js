PokemonApp.Pokemon = function (pokemonUri) { //Creates a pokemon based on the id from the URI
	this.id = PokemonApp.idFromUri(pokemonUri);
};

PokemonApp.Pokemon.prototype.render = function () { //Renders pokemon data
	console.log("Rendering pokemon: #" + this.id);

	$.ajax({
		url: "api/pokemon/" + this.id,
		success: showData
	});

	function showData(response) {
		console.log("Pokemon info:");
		console.log(response);

		showBasicData(response);
		showTypes(response);
		showImage(response);
		showDescriptions(response);

		$(".js-pokemon-modal").modal("show");
	}

	function showBasicData(response) {
		$(".js-pokemon-name").text(response.name);
		$(".js-pokemon-number").text("#" + response.pkdx_id);
		$(".js-pokemon-height").text(response.height + " ft.");
		$(".js-pokemon-weight").text(response.weight + " lbs.");
		$(".js-pokemon-hp").text(response.hp);
		$(".js-pokemon-att").text(response.attack);
		$(".js-pokemon-def").text(response.defense);
		$(".js-pokemon-sp-att").text(response.sp_atk);
		$(".js-pokemon-sp-def").text(response.sp_def);
		$(".js-pokemon-speed").text(response.speed);
	}

	function showTypes(response) {
		$('.js-type dd').remove();//removes the dd created for type prior

		var typeArray = response.types;//create array of types
		typeArray.forEach(function (type){
			var html = `<dd>${type.name}</dd>`;

			$('.js-pokemon-type').after(html);//adds each type from the array
		});
	}

	function showImage(response) {
		var spriteUrl = response.sprites[0].resource_uri//Add image

		$.ajax({
			url: spriteUrl,
			success: function(response){
				var imageUrl = response.image
				var urlStart = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
				var urlEndArray = imageUrl.split("/")
				var urlEnd = urlEndArray[urlEndArray.length - 1]
				var urlFinal = urlStart + "/" + urlEnd
				$('#img').empty();
				document.getElementById("img").src = urlFinal
			}
		});
	}

	function showDescriptions(response) {
		var descriptionsUrl = response.descriptions[0].resource_uri//Add image

		$.ajax({
			url: descriptionsUrl,
			success: function(response){
				var descriptionHtml = `<dd>${response.description}</dd>`
				$('.js-pokemon-description').after(descriptionHtml)
			}
		});
	}

};

PokemonApp.idFromUri = function (pokemonUri) { //Gets the ID from URI
	var uriSegments = pokemonUri.split("/"); //Gets URI segment
	var secondLast = uriSegments.length - 2; //penultimate position in URI
	return uriSegments[secondLast]; //Calls penultimate position in URI
};

$(document).on("ready", function (){//When HTML is fully loaded

	$(".js-show-pokemon").on("click", function (event) {//When you click on a pokemon button
		var $button = $(event.currentTarget);//save the pokemon you clicked into a variable
		var pokemonUri = $button.data("pokemon-uri");//insert uri into the data tag from the button

		var pokemon = new PokemonApp.Pokemon(pokemonUri);//create new pokemon 
		pokemon.render();//Render the pokemon
	});

});

