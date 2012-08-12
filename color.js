function fadeHint(divId,color) {
	switch(color) {
		case "green":
		color = "#17A255";
		break;

		case "blue":
		color = "#1DA4ED";
		break;
	
		case "yellow":
		color = "#fff47d";
		break;

		default: //if "grey" or some misspelled name (error safe).
		color = "#ACACAC";
		break;
	}

	//(This example comes from a project which used three main site colors: 
	//Green, Blue, and Grey)

	$(divId).css("-webkit-transition","all 1.5s ease")
	.css("backgroundColor","white")
	.css("-moz-transition","all 1.5s ease")
	.css("-o-transition","all 1.5s ease")
	.css("-ms-transition","all 1.5s ease")
	/* Avoiding having to use a jQ plugin. */

	.css("backgroundColor",color).delay(500).queue(function() {
		$(this).css("backgroundColor","white"); 
		$(this).dequeue(); //Prevents box from holding color with no fadeOut on second click.
	}); 
	//three distinct colors of green, grey, and blue will be set here.
}