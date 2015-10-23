# Simple Video Search Engine

This open source project inspired from http://scan.video (private content for obvious reasons). It has been extremely simplified and can be shared with everyone. It is a basic Video Search Engine that extracts content from Youtube videos based on a set of keywords. It collects the caption of a given video and applies a basic text search. Easily customizable, it's a great starting point if you want to build your own video search engine. You can apply your own search algorithm in the extractData() function as shown below in ExtractService.java

		...
			
		public List<String> extractData(String videoId, String keywords, String port) {

		// Get Video Caption file
		String videoUrl = "https://www.youtube.com/watch?v=" + videoId;
		String captionString = PhantomService.makeCaptionVisible(videoUrl, port);		
		List<String> extractedContent = new ArrayList<String>();
		
		/**
		* APPLY YOUR OWN SEARCH ALGORITHM HERE
		*/
		
		...	



Requirements:
- Java 8
- Tomcat 8
- PhantomJS
- Maven

PhantomJS

If you want to manage your own phantomJS process you can specify your own port in youtube.properties . It will create a RemoteWebDriver and connect to it.

		videosearch.phantom.port=9980

Don't forget to add your own Youtube API credentials in youtube.properties

		youtube.apikey=YOUR_API_KEY

and in client_secrets.json

		{
			"installed": {
				"client_id": "YOUR_CLIENT_ID",
				"client_secret": "YOUR_SECRET"
			}
		}

