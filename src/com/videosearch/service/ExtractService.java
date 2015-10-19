/**
 * @author allfou - Open Sourced - 2015
 */
package com.videosearch.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class ExtractService {

	/**
	 * extractData
	 * 
	 * @param searchResultList
	 */
	public List<String> extractData(String videoId, String keywords, String port) {

		// Get Video Caption file
		String videoUrl = "https://www.youtube.com/watch?v=" + videoId;
		String captionString = PhantomService.makeCaptionVisible(videoUrl, port);		
		List<String> extractedContent = new ArrayList<String>();
		
		/**
		* APPLY YOUR OWN SEARCH ALGORITHM HERE
		*/
		// ...		
		
		/**
		* OR USE BASIC STRING MATCHING SEARCH
		*/
		if (captionString != "") {							
			// Extract data from Caption file
			Scanner scanner = new Scanner(captionString);
			while (scanner.hasNextLine()) {
			  String captionline = scanner.nextLine();			  
			  // Check if this text line should be extracted
			  if (captionline.toLowerCase().contains(keywords.toLowerCase())) {
				  // Pretty format line
				  captionline = new StringBuilder(captionline).insert(captionline.indexOf(":") + 3, " - ").toString();
				  extractedContent.add(captionline);
				  System.out.println(captionline);
			  }			  			  
			}
			scanner.close();	
		}
		
		return extractedContent;
	}	
}
