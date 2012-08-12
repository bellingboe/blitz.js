function fadeHint(divId,color) {
	switch(color) {
		case "green":
		color = "#17A255";
		break;

		case "blue":
		color = "#1DA4ED";
		break;
	
		case "yellow":
		color = "#fff9d7";
		break;

		default: //if "grey" or some misspelled name (error safe).
		color = "#ACACAC";
		break;
	}

	//(This example comes from a project which used three main site colors: 
	//Green, Blue, and Grey)

	$(divId).css("backgroundColor",color).css("-webkit-transition","all 0.1s ease").delay(2000).css("-webkit-transition","all 3.5s ease")
	.css("backgroundColor","white")
	.css("-moz-transition","all 3.5s ease")
	.css("-o-transition","all 3.5s ease")
	.css("-ms-transition","all 3.5s ease")
	/* Avoiding having to use a jQ plugin. */

	.css("backgroundColor",color).delay(500).queue(function() {
		$(this).css("backgroundColor","white"); 
		$(this).dequeue(); //Prevents box from holding color with no fadeOut on second click.
	}); 
}