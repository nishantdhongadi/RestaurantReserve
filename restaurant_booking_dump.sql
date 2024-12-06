--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: reservations; Type: TABLE; Schema: public; Owner: nishant
--

CREATE TABLE public.reservations (
    reservationid integer NOT NULL,
    userid integer,
    restaurantid integer,
    reservationdate date,
    reservationtime time without time zone,
    numberofguests integer,
    notes character varying(255),
    status character varying(50)
);


ALTER TABLE public.reservations OWNER TO nishant;

--
-- Name: restaurants; Type: TABLE; Schema: public; Owner: nishant
--

CREATE TABLE public.restaurants (
    restaurantid integer NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    phonenumber character varying(15),
    email character varying(255),
    cuisine character varying(255),
    operatinghours character varying(255),
    averagerating numeric(3,2),
    tablenumber character varying(255)
);


ALTER TABLE public.restaurants OWNER TO nishant;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: nishant
--

CREATE TABLE public.reviews (
    reviewid integer NOT NULL,
    userid integer,
    restaurantid integer,
    ratingvalue numeric(2,1),
    comment text,
    dateposted date
);


ALTER TABLE public.reviews OWNER TO nishant;

--
-- Name: users; Type: TABLE; Schema: public; Owner: nishant
--

CREATE TABLE public.users (
    userid integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phonenumber character varying(15),
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO nishant;

--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: nishant
--

COPY public.reservations (reservationid, userid, restaurantid, reservationdate, reservationtime, numberofguests, notes, status) FROM stdin;
\.


--
-- Data for Name: restaurants; Type: TABLE DATA; Schema: public; Owner: nishant
--

COPY public.restaurants (restaurantid, name, address, phonenumber, email, cuisine, operatinghours, averagerating, tablenumber) FROM stdin;
1	Test Restaurant	123 Main St	1234567890	restaurant@example.com	Italian	10:00-22:00	\N	\N
2	Test Restaurant	123 Test Street	123-456-7890	test@restaurant.com	Italian	9:00 AM - 10:00 PM	4.00	10
3	Test Restaurant	123 Test Street	123-456-7890	test@restaurant.com	Italian	9:00 AM - 10:00 PM	4.00	10
4	Test Restaurant	123 Test Street	123-456-7890	test@restaurant.com	Italian	9:00 AM - 10:00 PM	4.00	10
5	new test	xyz st	123456789	test@example.com	American	2:00-6:00	5.00	225
6	newer test	test st	1234832790	test@examl.com	nsocnoj	120	5.00	100
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: nishant
--

COPY public.reviews (reviewid, userid, restaurantid, ratingvalue, comment, dateposted) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nishant
--

COPY public.users (userid, username, email, phonenumber, password) FROM stdin;
1	test	test@example.com	6027238758	$2a$10$kwbI.XtSfuI9n0loMH4il.BUaILxhXP3qm15O5Qp4.eCMthRwBuAW
\.


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (reservationid);


--
-- Name: restaurants restaurants_pkey; Type: CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.restaurants
    ADD CONSTRAINT restaurants_pkey PRIMARY KEY (restaurantid);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (reviewid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (userid);


--
-- Name: reservations reservations_restaurantid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_restaurantid_fkey FOREIGN KEY (restaurantid) REFERENCES public.restaurants(restaurantid);


--
-- Name: reservations reservations_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- Name: reviews reviews_restaurantid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_restaurantid_fkey FOREIGN KEY (restaurantid) REFERENCES public.restaurants(restaurantid);


--
-- Name: reviews reviews_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nishant
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(userid);


--
-- PostgreSQL database dump complete
--

