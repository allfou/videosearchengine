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

import com.videosearch.service.ExtractService;

@Path("/extract")
public class ExtractController {

	  @GET
	  @Produces("application/json")
	  public Response extractWithoutParams() throws JSONException {
		  return null;
	  }

	  @Path("{videoid}/{keywords}/{port}")
	  @GET
	  @Produces("application/json")
	  public Response extractWithParams(@PathParam("videoid") String videoid, 
			  							@PathParam("keywords") String keywords,
			  							@PathParam("port") String port) throws JSONException {		  
			JSONObject jsonObject = new JSONObject(); 		 			 
			ExtractService extractService = new ExtractService();						
			jsonObject.put("search_result", extractService.extractData(videoid, keywords, port));				
			String result = jsonObject.toString();
			
			return Response.status(200).entity(result).build();
	  }
}