/**
 * @author allfou - Open Sourced - 2015
 */
package com.videosearch.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;

import com.videosearch.service.SearchService;
 
@Path("/search")
public class SearchController {
 
	  @GET
	  @Produces("application/json")
	  public Response searchWithoutParams() throws JSONException {
		return null;
	  }
 
	  @Path("{keywords}")
	  @GET
	  @Produces("application/json")
	  public Response searchWithParams(@PathParam("keywords") String keywords) throws JSONException {		  
		JSONObject jsonObject = new JSONObject(); 		 
		  
		// Query Google Search API
		SearchService searchService = new SearchService();
		try {						
			jsonObject.put("video_id", searchService.getVideoByKeyword(keywords));			
		} catch (Exception e) {
			e.printStackTrace();
		}		
		String result = jsonObject.toString();
		
		// Return a list of videos based on keywords
		return Response.status(200).entity(result).build();
	  }
}
