PGDMP                      |            cluster_4gc2    16.3 (Debian 16.3-1.pgdg120+1)    16.3 "    @           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            A           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            B           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            C           1262    16389    cluster_4gc2    DATABASE     w   CREATE DATABASE cluster_4gc2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE cluster_4gc2;
                i358    false            D           0    0    cluster_4gc2    DATABASE PROPERTIES     5   ALTER DATABASE cluster_4gc2 SET "TimeZone" TO 'utc';
                     i358    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                i358    false            E           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   i358    false    5            �            1259    16443    banned    TABLE     �   CREATE TABLE public.banned (
    id numeric NOT NULL,
    "bannedBy" numeric NOT NULL,
    permanent boolean NOT NULL,
    "expiresAt" numeric NOT NULL,
    ip numeric NOT NULL
);
    DROP TABLE public.banned;
       public         heap    i358    false    5            �            1259    16451    logs    TABLE     �   CREATE TABLE public.logs (
    id integer NOT NULL,
    type text NOT NULL,
    message text NOT NULL,
    "readChannel" text NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "verifyChannel" text NOT NULL,
    cache text NOT NULL
);
    DROP TABLE public.logs;
       public         heap    i358    false    5            �            1259    16450    logs_id_seq    SEQUENCE     �   CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.logs_id_seq;
       public          i358    false    217    5            F           0    0    logs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;
          public          i358    false    216            �            1259    16460    messages    TABLE     �   CREATE TABLE public.messages (
    pgid integer NOT NULL,
    id bigint NOT NULL,
    "senderId" numeric NOT NULL,
    content text NOT NULL,
    attachments text,
    mentions text,
    reply numeric,
    "createdAt" numeric NOT NULL
);
    DROP TABLE public.messages;
       public         heap    i358    false    5            �            1259    16459    messages_pgid_seq    SEQUENCE     �   CREATE SEQUENCE public.messages_pgid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.messages_pgid_seq;
       public          i358    false    219    5            G           0    0    messages_pgid_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.messages_pgid_seq OWNED BY public.messages.pgid;
          public          i358    false    218            �            1259    16468    secrets    TABLE     u   CREATE TABLE public.secrets (
    id numeric NOT NULL,
    secret text NOT NULL,
    "createdAt" numeric NOT NULL
);
    DROP TABLE public.secrets;
       public         heap    i358    false    5            �            1259    16476    users    TABLE       CREATE TABLE public.users (
    pgid integer NOT NULL,
    id bigint NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    "createdAt" numeric NOT NULL,
    color text NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    "permLevels" text[]
);
    DROP TABLE public.users;
       public         heap    i358    false    5            �            1259    16475    users_pgid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_pgid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.users_pgid_seq;
       public          i358    false    222    5            H           0    0    users_pgid_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.users_pgid_seq OWNED BY public.users.pgid;
          public          i358    false    221            �           2604    16454    logs id    DEFAULT     b   ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);
 6   ALTER TABLE public.logs ALTER COLUMN id DROP DEFAULT;
       public          i358    false    216    217    217            �           2604    16463    messages pgid    DEFAULT     n   ALTER TABLE ONLY public.messages ALTER COLUMN pgid SET DEFAULT nextval('public.messages_pgid_seq'::regclass);
 <   ALTER TABLE public.messages ALTER COLUMN pgid DROP DEFAULT;
       public          i358    false    218    219    219            �           2604    16479 
   users pgid    DEFAULT     h   ALTER TABLE ONLY public.users ALTER COLUMN pgid SET DEFAULT nextval('public.users_pgid_seq'::regclass);
 9   ALTER TABLE public.users ALTER COLUMN pgid DROP DEFAULT;
       public          i358    false    221    222    222            6          0    16443    banned 
   TABLE DATA           L   COPY public.banned (id, "bannedBy", permanent, "expiresAt", ip) FROM stdin;
    public          i358    false    215   �"       8          0    16451    logs 
   TABLE DATA           e   COPY public.logs (id, type, message, "readChannel", "createdAt", "verifyChannel", cache) FROM stdin;
    public          i358    false    217   �"       :          0    16460    messages 
   TABLE DATA           l   COPY public.messages (pgid, id, "senderId", content, attachments, mentions, reply, "createdAt") FROM stdin;
    public          i358    false    219   #       ;          0    16468    secrets 
   TABLE DATA           :   COPY public.secrets (id, secret, "createdAt") FROM stdin;
    public          i358    false    220   8#       =          0    16476    users 
   TABLE DATA           f   COPY public.users (pgid, id, username, email, "createdAt", color, verified, "permLevels") FROM stdin;
    public          i358    false    222   U#       I           0    0    logs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.logs_id_seq', 1, false);
          public          i358    false    216            J           0    0    messages_pgid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.messages_pgid_seq', 1, false);
          public          i358    false    218            K           0    0    users_pgid_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.users_pgid_seq', 1, false);
          public          i358    false    221            �           2606    16449    banned banned_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.banned
    ADD CONSTRAINT banned_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.banned DROP CONSTRAINT banned_pkey;
       public            i358    false    215            �           2606    16458    logs logs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.logs DROP CONSTRAINT logs_pkey;
       public            i358    false    217            �           2606    16467    messages messages_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.messages DROP CONSTRAINT messages_pkey;
       public            i358    false    219            �           2606    16474    secrets secrets_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.secrets
    ADD CONSTRAINT secrets_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.secrets DROP CONSTRAINT secrets_pkey;
       public            i358    false    220            �           2606    16484    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            i358    false    222            6      x������ � �      8      x������ � �      :      x������ � �      ;      x������ � �      =      x������ � �     