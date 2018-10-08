from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import datetime as dt

def full_scrape():
    browser = Browser("chrome", executable_path="chromedriver", headless=True)
    news_title, news_p = news(browser)

    # Scraping dictionary
    data = {
        "news_title": news_title,
        "news_paragraph": news_p,
        "featured_image": featured_image(browser),
        "hemispheres": hemispheres(browser),
        "weather": twitter_weather(browser),
        "facts": mars_facts(),
        "last_modified": dt.datetime.now()
    }

    browser.quit()
    return data

def news(browser): 
    url = "https://mars.nasa.gov/news/?page=0&per_page=40&order=publish_date+desc%2Ccreated_at+desc&search=&category=19%2C165%2C184%2C204&blank_scope=Latest"
    browser.visit(url)

    browser.is_element_present_by_css("ul.item_list li.slide", wait_time=0.5)

    html = browser.html
    soup = bs(html, "html.parser")

    try:
        slide_elem = soup.select_one("ul.item_list li.slide")
        news_title = slide_elem.find("div", class_="content_title").get_text()
        news_p = slide_elem.find("div", class_="article_teaser").get_text()

    except AttributeError:
        return None, None

    return news_title, news_p

def featured_image(browser):
    url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    browser.visit(url)

    featured_img= browser.find_by_id('full_image')
    featured_img.click()

    browser.is_element_present_by_text("more info", wait_time=0.5)
    more_info_elem = browser.find_link_by_partial_text("more info")
    more_info_elem.click()

    html = browser.html
    soup = bs(html, "html.parser")

    mars_img = soup.select_one('figure.lede a img')

    try: 
        img_url_rel = mars_img.get("src")
    
    except AttributeError:
        return None

    full_url = f'https://www.jpl.nasa.gov{mars_img}'

    return full_url

def scrape_hemisphere(html_text):
    soup = bs(html_text, "html.parser")

    try: 
        title_elem = soup.find("h2", class_="title").get_text()
        sample_elem = soup.find("a", text="Sample").get("href")
    
    except AttributeError: 

        title_elem = None
        sample_elem = None

    hemisphere = {
        "title": title_elem, 
        "img_url": sample_elem
    }

    return hemisphere

def hemispheres(browser):

    url = ("https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars")
    browser.visit(url)

    hemisphere_urls = []

    for i in range(4):
        browser.find_by_css("a.product-item h3")[i].click()

        hemi_data = scrape_hemisphere(browser.html)

        browser.back()

    return hemisphere_urls

def twitter_weather(browser):
    
    url ="https://twitter.com/marswxreport?lang=en"
    browser.visit(url)

    html = browser.html
    soup = bs(html, "html.parser")

    tweet_attrs = {"class": "tweet", "data-name": "Mars Weather"}
    weather_tweets = soup.find("div", attrs=tweet_attrs)    

    mars_weather = weather_tweets.find("p", "tweet-text").get_text()

    return mars_weather

def mars_facts():
    try: 
        facts_df = pd.read_html("http://space-facts.com/mars/")[0]
    except BaseException: 
        return None

    facts_df.columns=['category', 'value']
    facts_df.set_index('category', inplace=True)

    return facts_df.to_html(classes="table table-striped")

if __name__ == "__main__":

    print(scrape_all())


    
