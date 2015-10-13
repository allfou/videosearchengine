# videosearch
Simplified version of a Video Search Engine that extracts content from Youtube videos based on a set of keywords. It collects the caption of a given video and applies a basic text search. Easily customizable it's a great starting point if you want to build your own video search engine. You can apply your own search algorithm in the extractData() function as shown below in ExtractService.java

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

youtube.apikey=AIzaSyCxEa2x9fyqv8UHLKlmCfNXFzimui_wB1g

and in client_secrets.json

{
  "installed": {
      "client_id": "314107975437-gf3vss30p62qiukn6rg25u930lsvfthf.apps.googleusercontent.com",
      "client_secret": "pWXYbYB9xKL8K94e8X7F6lPZ"
  }
}