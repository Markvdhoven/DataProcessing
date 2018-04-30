#!/usr/bin/env python
# Name: Mark van den Hoven
# Student number: 10533133
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""
import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup


TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED TV-SERIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.

    # create list to stall all movies in
    list_of_movies = []

    # make a soup of the imdb html
    soup = BeautifulSoup(html, 'html.parser')

    # get all needed soups    
    movies = soup.find_all("div", class_="lister-item-content")
    movie = soup.find_all("h3", class_="lister-item-header")
    genre = soup.find_all("span", class_="genre")
    actors = soup.select('a[href*="adv_li_st_"]')
    runtime = soup.find_all("span", class_="runtime")
    rating = soup.find_all("div", class_="inline-block ratings-imdb-rating")

    # start a count for actors
    actorcount = 0

    # loop over all movies
    for i in range(50):
        
        # create list to stall movie information
        movie_list = []

        # create string to add in movie actors
        actorr = ""

        # add movie to list
        movie_list.append(movie[i].find("a").string)

        # add rating to list
        movie_list.append(rating[i].strong.string)

        # add genre to list
        movie_list.append(genre[i].string.strip())
        
        # iterate over first 3 actors
        for j in range(actorcount, actorcount + 3):

            # add each actor to the actor string plus a comma
            actorr += (actors[j].string) + ", "

        # add last actor to string without a comma
        actorr += actors[actorcount + 3].string

        # add string of actors to list
        movie_list.append(actorr)

        # go to next four actors for next movie
        actorcount += 4

        # add movie runtime to list
        movie_list.append((runtime[i].string).strip(' min'))

        # add list with movie information to list of movies
        list_of_movies.append(movie_list)
    
    return list_of_movies


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)

    # write top of columns
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write all columns for each movie
    for i in range(50):
            writer.writerow([tvseries[i][0], tvseries[i][1], tvseries[i][2], tvseries[i][3], tvseries[i][4]]) 


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
