/**
 * @author allfou - Open Sourced - 2015
 */
package com.videosearch.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import com.videosearch.service.SearchService;

public final class Utils {

	private static final String PROPERTIES_FILENAME = "youtube.properties";
	private static Properties properties;
	
	/**
	 * 	Constructor: avoid instantiations
	 */
	private Utils() {
	}
	
	/**
	 * Loads Properties file
	 */
	public static void initProperties() {		
		properties = new Properties();
		try {
			InputStream in = SearchService.class.getResourceAsStream("/" + PROPERTIES_FILENAME);
			properties.load(in);
		} catch (IOException e) {
			System.err.println("There was an error reading " + PROPERTIES_FILENAME + ": " + e.getCause() + " : " + e.getMessage());
			System.exit(1);
		}		
	}
	
	/**
	 * Returns a value for a given key
	 * 
	 * @param key
	 * @return value
	 */
	public static String getProperty(String key) {
		if (properties != null) {			
			return properties.getProperty(key);
		} else {
			initProperties();
			return properties.getProperty(key);
		}			
	}	
}
