--
-- PostgreSQL database cluster dump
--

-- Started on 2024-09-15 14:46:25

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:iRhBAA8Nl/UN7tvAn+iLOw==$RQpnX9ZhzaJmIa5QrV9KsD9qE3nfAbX2M/+uXyPlDxg=:NAm3vG0fIvRMVg8W/UyS7wEFuu7OR+qGh2qs5c8TQDI=';
--
-- PostgreSQL database dump complete
--

--
-- Database "storage" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4
--
-- TOC entry 4875 (class 1262 OID 16396)
-- Name: storage; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE storage WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE storage OWNER TO postgres;

\connect storage

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
-- TOC entry 215 (class 1259 OID 16397)
-- Name: banned; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banned (
    id numeric NOT NULL,
    "bannedBy" numeric NOT NULL,
    permanent boolean NOT NULL,
    "expiresAt" numeric NOT NULL,
    ip numeric NOT NULL
);


ALTER TABLE public.banned OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16405)
-- Name: logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.logs (
    id integer NOT NULL,
    type text NOT NULL,
    message text NOT NULL,
    "readChannel" text NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "verifyChannel" text NOT NULL,
    cache text NOT NULL
);


ALTER TABLE public.logs OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16404)
-- Name: logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.logs_id_seq OWNER TO postgres;

--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 216
-- Name: logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;


--
-- TOC entry 219 (class 1259 OID 16414)
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    pgid integer NOT NULL,
    id bigint NOT NULL,
    "senderId" numeric NOT NULL,
    content text NOT NULL,
    mentions text,
    reply numeric,
    "createdAt" numeric NOT NULL,
    attachments text NOT NULL
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16413)
-- Name: messages_pgid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.messages_pgid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_pgid_seq OWNER TO postgres;

--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 218
-- Name: messages_pgid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.messages_pgid_seq OWNED BY public.messages.pgid;


--
-- TOC entry 220 (class 1259 OID 16422)
-- Name: secrets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.secrets (
    id numeric NOT NULL,
    secret text NOT NULL,
    "createdAt" numeric NOT NULL
);


ALTER TABLE public.secrets OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16430)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    pgid integer NOT NULL,
    id bigint NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "createdAt" numeric NOT NULL,
    color text NOT NULL,
    "permLevels" text NOT NULL,
    ip_addr text NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16429)
-- Name: users_pgid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_pgid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_pgid_seq OWNER TO postgres;

--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_pgid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_pgid_seq OWNED BY public.users.pgid;


--
-- TOC entry 4706 (class 2604 OID 16408)
-- Name: logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);


--
-- TOC entry 4707 (class 2604 OID 16417)
-- Name: messages pgid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages ALTER COLUMN pgid SET DEFAULT nextval('public.messages_pgid_seq'::regclass);


--
-- TOC entry 4708 (class 2604 OID 16433)
-- Name: users pgid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN pgid SET DEFAULT nextval('public.users_pgid_seq'::regclass);

--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 216
-- Name: logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.logs_id_seq', 3, true);


--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 218
-- Name: messages_pgid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.messages_pgid_seq', 5, true);


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_pgid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_pgid_seq', 2, true);


--
-- TOC entry 4710 (class 2606 OID 16403)
-- Name: banned banned_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banned
    ADD CONSTRAINT banned_pkey PRIMARY KEY (id);


--
-- TOC entry 4712 (class 2606 OID 16412)
-- Name: logs logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4714 (class 2606 OID 16421)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4716 (class 2606 OID 16428)
-- Name: secrets secrets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secrets
    ADD CONSTRAINT secrets_pkey PRIMARY KEY (id);


--
-- TOC entry 4718 (class 2606 OID 16437)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


-- Completed on 2024-09-15 14:46:28

--
-- PostgreSQL database dump complete
--

-- Completed on 2024-09-15 14:46:28

--
-- PostgreSQL database cluster dump complete
--

