$(document).ready(function() {
	var width = 420, height = 420;
	// Call Library function
	nuwe_charts('demo1', {
		width: width,
		height: height
	});
	
	nuwe_charts('demo2', null);

	nuwe_charts('demo3', 
		{
			score: 721,
        	amount: [{
	            value: 930,
	            maxValue: 1000
	        },
	        {
	            value: 453,
	            maxValue: 1000
	        },
	        {
	            value: 780,
	            maxValue: 1000
	        }]
	    });


	nuwe_charts('demo4', {
        ringCount: 5,
        colorTable: ['#009D76', '#ff8300', '#cd3df6', "#FF0000", "#0FAF0F"],
        score: 85,
        maxValue: 100,
    	amount: [
    		{
	            value: 865,
	            maxValue: 1000
	        },
	        {
	            value: 930,
	            maxValue: 1000
	        },
    		{
	            value: 777,
	            maxValue: 1000
	        },
	        {
	            value: 912,
	            maxValue: 1000
	        },
	        {
	            value: 780,
	            maxValue: 1000
	        }]
    });
});