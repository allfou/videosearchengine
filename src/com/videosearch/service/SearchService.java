/**
 * @author allfou - Open Sourced - 2015
 */
package com.videosearch.service;

import java.io.IOException;
import java.util.List;

import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.services.youtube.YouTube;
import com.google.api.services.youtube.model.SearchListResponse;
import com.google.api.services.youtube.model.SearchResult;
import com.videosearch.utils.Utils;

public class SearchService {

	private static YouTube youtube;
	
	/**
	 * getVideoByKeyword
	 * 
	 * @param keywords
	 * @return
	 * @throws IOException
	 */
	public List<SearchResult> getVideoByKeyword(String keywords) throws IOException {
			
		// Load properties.file
		Utils.initProperties();
		System.out.println("Searching for " + keywords);
		
		try {
			// This object is used to make YouTube Data API requests. The last
			// argument is required, but since we don't need anything
			// initialized when the HttpRequest is initialized, we override
			// the interface and provide a no-op function.
			youtube = new YouTube.Builder(AuthService.HTTP_TRANSPORT, AuthService.JSON_FACTORY,
					new HttpRequestInitializer() {
						public void initialize(HttpRequest request) throws IOException {
						}
					}).setApplicationName("youtube-cmdline-search-sample").build();

			// Define the API request for retrieving search results.
			YouTube.Search.List search = youtube.search().list("id,snippet");
			String apiKey = Utils.getProperty("youtube.apikey");
			search.setKey(apiKey);
			search.setQ(keywords);
			search.setRelevanceLanguage("en");
			search.setRegionCode("US");
			// Only include videos that have captions.
			search.setVideoCaption("closedCaption"); 
			// Restrict the search results to only include videos. See:
			search.setType("video");
			// To increase efficiency, only retrieve the fields that the application uses.
			// search.setFields("items(id/kind,id/videoId,snippet/title,snippet/thumbnails/default/url)");
			search.setFields("items(id/videoId,snippet/title)");
			search.setMaxResults(Long.parseLong(Utils.getProperty("videosearch.maxitems")));

			// Call the API and print results.
			SearchListResponse searchResponse = search.execute();
			List<SearchResult> searchResultList = searchResponse.getItems();

			return searchResultList;
		} catch (GoogleJsonResponseException e) {
			System.err.println("There was a service error: " + e.getDetails().getCode() + " : " + e.getDetails().getMessage());
		} catch (IOException e) {
			System.err.println("There was an IO error: " + e.getCause() + " : " + e.getMessage());
		} catch (Throwable t) {
			t.printStackTrace();
		}

		return null;
	}
}
