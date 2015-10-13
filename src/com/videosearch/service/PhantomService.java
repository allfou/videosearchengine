/**
 * @author allfou - Open Sourced - 2015
 */
package com.videosearch.service;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.phantomjs.PhantomJSDriver;
import org.openqa.selenium.phantomjs.PhantomJSDriverService;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import com.videosearch.utils.Utils;

public class PhantomService {

	public PhantomService() {
		// constructor
	}
	
	public synchronized static String makeCaptionVisible(String url, String port) {
		DesiredCapabilities caps = new DesiredCapabilities();
		caps.setCapability(PhantomJSDriverService.PHANTOMJS_EXECUTABLE_PATH_PROPERTY, "/usr/local/bin/phantomjs");                  

		// Check if we specified a port number then connect to remote phantom.
		// Else, create a new instance of phantom
		WebDriver driver = null;
		
		if (Utils.getProperty("videosearch.phantom.port") != null) {
			int portProperties = Integer.parseInt(Utils.getProperty("videosearch.phantom.port"));
			int portInt = portProperties + Integer.parseInt(port);
			URL siteBase = null;
			try {
				siteBase = new URL("http://localhost:" + Integer.toString(portInt) + "/");
			} catch (MalformedURLException e) {
				e.printStackTrace();
			}			
			try {
				// connect to remote phantom at given port
				driver = new RemoteWebDriver(siteBase, caps);
			} catch (org.openqa.selenium.remote.UnreachableBrowserException e) {
				// if remote phantom is not reachable then create a fresh phantom instance
				driver = new PhantomJSDriver(caps);
			}			
		} else {
			// if no port is specified in properties file then create a fresh phantom instance
			driver = new PhantomJSDriver(caps);
		}
							
		try {					
			Actions action = new Actions(driver);
			driver.get(url);
			
			WebDriverWait waitForMoreButton = new WebDriverWait(driver, 1);
			waitForMoreButton.until(ExpectedConditions.visibilityOfElementLocated(By.id("action-panel-overflow-button")));
			
			TimeUnit.MILLISECONDS.sleep(300);
			
			WebElement moreButton = driver.findElement(By.id("action-panel-overflow-button"));			
			action.click(moreButton);
			action.perform();

			TimeUnit.MILLISECONDS.sleep(300);
			
			WebDriverWait waitForTrigger = new WebDriverWait(driver, 1);
			waitForTrigger.until(ExpectedConditions.visibilityOfElementLocated(By.className("action-panel-trigger-transcript")));

			WebElement transcriptElement = driver.findElement(By.className("action-panel-trigger-transcript"));
			action.click(transcriptElement);
			action.perform();

			TimeUnit.MILLISECONDS.sleep(500);
			
			WebDriverWait waitForTranscriptElement = new WebDriverWait(driver, 1);
			waitForTranscriptElement.until(ExpectedConditions.visibilityOfElementLocated(By.id("transcript-scrollbox")));

			WebElement captionElement = driver.findElement(By.id("transcript-scrollbox"));
			String captionText = captionElement.getText();	

			driver.quit();	
			
			return captionText;	
		} catch (org.openqa.selenium.TimeoutException e) {
			e.printStackTrace();
			driver.quit();
		} catch (InterruptedException e) {			
			e.printStackTrace();
		} finally {
			driver.quit();
		}	
		
		return "";
	}
}