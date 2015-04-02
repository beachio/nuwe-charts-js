- Collaboration

To run the application, we encourage you to run it with Grunt.

In the below instruction, we assume that you have node/npm installed
- npm install
- npm install -g bower
- bower install

Use 'grunt serve' to launch the application. You are free to change the port number, but for your information, the default port number is 8080
You can access it on http://localhost:8080

Navigate to /src to see the examples


- Use this library for your project.
You need to include only Raphael.js and our chart library nuwe_charts.js
You can get a grab of nuwe_chart.js from src folder.

Below you can find the simple but yet typical example of using our chart library.

	nuwe_charts('demo1', 
	{
		'data': [
			{
		    	"color": "#0055e8",
		    	"amount": 721,
		    	"maxValue": 1000,
		    	"textLabel": "Overall",
		    	"textLabelColor": "#ffffff"
			},
			{
		    	"color": "#009D76",
		    	"amount": 930,
		    	"maxValue": 1000,
		    	"textLabel": "Food",
		    	"textLabelColor": "#ffffff"
			},
			{
		    	"color": "#ff8300",
		    	"amount": 453,
		    	"maxValue": 1000,
		    	"textLabel": "Nutrition",
		    	"textLabelColor": "#ffffff"
			},
			{
		    	"color": "#cd3df6",
		    	"amount": 780,
		    	"maxValue": 1000,
		    	"textLabel": "Exercise",
		    	"textLabelColor": "#ffffff"
			}
		]
	});

Explaination about the data structure above: 
    The first of the array is indicating the inner-most circle.
    The others are indicating the actual data for the arc.

I think the explanation about the individual field are not necessary as the fields are self-explanatory, just remember 'color' stands for 'background-color'.