USE sakila ;

SELECT * FROM actor;

-- 1a. Display the first and last names of all actors from the table actor
SELECT first_name, last_name
FROM actor;

-- 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
SELECT CONCAT(first_name , ' ' , last_name) 
AS 'Actor_Name'  
FROM actor;

-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." 
-- 2a. What is one query would you use to obtain this information?
SELECT actor_id, first_name, last_name 
FROM actor
WHERE first_name = 'JOE';

-- 2b. Find all actors whose last name contain the letters GEN:
SELECT first_name, last_name
FROM actor
WHERE last_name LIKE '%gen%';

-- 2c. Find all actors whose last names contain the letters LI. 
-- 2c. This time, order the rows by last name and first name, in that order
SELECT first_name, last_name
from actor
WHERE last_name LIKE '%li%'
ORDER BY last_name, first_name;

-- 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China
SELECT * FROM country;

SELECT country_id, country 
FROM country
WHERE Country IN ('Afghanistan' , 'Bangladesh' , 'China');

-- 3a. Add a middle_name column to the table actor. 
-- 3a. Position it between first_name and last_name. Hint: you will need to specify the data type.
ALTER TABLE actor
ADD middle_name VARCHAR(200) AFTER first_name; 

SELECT * FROM actor;

-- 3b. You realize that some of these actors have tremendously long last names. 
-- 3b. Change the data type of the middle_name column to blobs
ALTER TABLE actor
MODIFY COLUMN middle_name BLOB;

-- 3c. Now delete the middle_name column. 
ALTER TABLE actor DROP COLUMN middle_name;

SELECT * FROM actor;

-- 4a. List the last names of actors, as well as how many actors have that last name.
SELECT last_name, COUNT(*) AS count
FROM actor
GROUP BY last_name;

-- 4b. List last names of actors and the number of actors who have that last name,
-- 4b. but only for names that are shared by at least two actors
SELECT last_name, COUNT(*) AS count
FROM actor
GROUP BY last_name
HAVING count > 1;

-- 4c. Oh, no! The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS, 
-- 4c. the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.
UPDATE actor
SET first_name = 'Harpo' 
WHERE first_name = 'Groucho';

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! 
-- 4d. In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. 
-- 4d. Otherwise, change the first name to MUCHO GROUCHO, as that is exactly what the actor will be with the grievous error. 
-- 4d. BE CAREFUL NOT TO CHANGE THE FIRST NAME OF EVERY ACTOR TO MUCHO GROUCHO, HOWEVER! (Hint: update the record using a unique identifier.)
UPDATE actor
SET first_name = 'Groucho' 
WHERE first_name = 'Harpo';

-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?
SHOW CREATE TABLE address;

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address
SELECT s.first_name, s.last_name, a.address
FROM staff s
JOIN address a 
ON s.address_id = a.address_id;

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment
SELECT s.first_name, s.last_name, SUM(p.amount)
FROM staff s
INNER JOIN payment p 
ON s.staff_id = p.staff_id
WHERE p.payment_date LIKE '%2005-08%'
GROUP BY s.staff_id;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join
SELECT film.title, COUNT(film_actor.actor_id)
FROM film_actor
INNER JOIN film
ON film.film_id = film_actor.film_id
GROUP BY film.title;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT COUNT(title)
FROM film
WHERE title = 'Hunchback Impossible';

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. 
-- 6e. List the customers alphabetically by last name: 
SELECT c.first_name, c.last_name, SUM(p.amount)
FROM customer c
INNER JOIN payment p 
ON c.customer_id = p.customer_id
GROUP BY last_name;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. 
-- 7a. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. 
-- 7a. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
SELECT title 
FROM film 
WHERE title LIKE 'K%' OR title LIKE 'Q%' AND language_id IN(
	SELECT language_id
    FROM language 
    WHERE name = 'English'
);

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.
SELECT first_name, last_name
FROM actor
WHERE actor_id IN (
	SELECT actor_id
    FROM film_actor
    WHERE film_id IN (
		SELECT film_id
        FROM film
        WHERE title = 'Alone Trip'
));

-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses 
-- 7c. of all Canadian customers. Use joins to retrieve this information.
SELECT c.first_name, c.last_name, c.email
FROM customer c
JOIN address a 
ON a.address_id = c.address_id
WHERE a.city_id IN (
	SELECT city_id 
    FROM city
    WHERE country_id IN(
		SELECT country_id
        FROM country 
        WHERE country = 'Canada'
));

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. 
-- 7d. Identify all movies categorized as famiy films.
SELECT title 
FROM film
WHERE film_id IN (
	SELECT film_id
    FROM film_category
    WHERE category_id IN(
		SELECT category_id
        FROM category
        WHERE name = 'Family'
));

-- 7e. Display the most frequently rented movies in descending order.
CREATE VIEW frequent_rentals AS 
SELECT i.film_id, r.inventory_id, COUNT(r.rental_id) AS frequency
FROM inventory i
JOIN rental r 
ON (i.inventory_id = r.inventory_id)
GROUP BY i.inventory_id;

SELECT * FROM frequent_rentals;

SELECT f.title, SUM(r.frequency) AS number_rentals
FROM frequent_rentals r
JOIN film f
ON f.film_id = r.film_id
GROUP BY r.film_id
ORDER BY number_rentals DESC;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
SELECT st.store_id, SUM(p.amount) 
FROM staff st
JOIN payment p
ON st.staff_id = p.staff_id
JOIN store s
ON s.store_id = st.store_id
GROUP BY s.store_id;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT s.store_id, ci.city, co.country
FROM store s
JOIN address a 
ON s.address_id = s.address_id
JOIN city ci
ON a.city_id = ci.city_id
JOIN country co 
ON ci.country_id = co.country_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: 
-- 7h. category, film_category, inventory, payment, and rental.)
SELECT c.category_id, c.name, SUM(p.amount) AS total
FROM category c
RIGHT JOIN film_category f
ON c.category_id = f.category_id
RIGHT JOIN inventory i
ON f.film_id = i.film_id
RIGHT JOIN rental r
ON i.inventory_id = r.inventory_id
RIGHT JOIN payment p
ON r.rental_id = p.rental_id
GROUP BY c.name
ORDER BY total DESC;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. 
-- 8a. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
CREATE VIEW top_five AS
SELECT c.category_id, c.name, sum(p.amount) AS total
FROM category c
RIGHT JOIN film_category f
ON c.category_id = f.category_id
RIGHT JOIN inventory i
ON f.film_id = i.film_id
RIGHT JOIN rental r
ON i.inventory_id = r.inventory_id
RIGHT JOIN payment p
ON r.rental_id = p.rental_id
GROUP BY c.name
ORDER BY total DESC
LIMIT 5;

-- 8b. How would you display the view that you created in 8a?
SELECT * FROM top_five;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW top_five;

