create extension if not exists "uuid-ossp";

create table if not exists products (
    id uuid primary key default  uuid_generate_v4(),
    title text not null,
    description text,
    price integer
);

create table if not exists stocks (
    product_id uuid primary key,
    count integer default 0,
    foreign key ("product_id") references "products" ("id") on delete cascade
);


insert into products (id, title, description, price) values
	('dba1619f-c6ab-4637-9185-bdb43e9510e4', 'A Smarter Way to Learn JavaScript: The new tech-assisted approach that requires half the effort', 'According to Mark Myers, the author of the A Smarter Way to Learn JavaScript, there are two important problems faced by those willing to learn JavaScript. These are retention and comprehension. As such, the JS book is written while especially addressing the two issues. It is the best book to learn javascript.', 10),
	('f104046e-f392-4f05-9ab4-10ba7c4a532b', 'Eloquent JavaScript: A Modern Introduction to Programming', 'Probably the biggest standout of Eloquent JavaScript: A Modern Introduction to Programming is its heavy usage of practice exercises. Unlike other books on programming and JS, this book is a work of pure art.', 20),
	('a7dcf986-e768-4d1e-b348-c052990e864c', 'JavaScript & JQuery: Interactive Front-End Web Development', 'Interested in learning JavaScript & jQuery side-by-side for getting started with web development? JavaScript and JQuery: Interactive Front-End Web Development is the top recommendation.', 30),
	('62d24ecf-b014-41b4-b513-dca890db6014', 'JavaScript: The Good Parts', 'With the JavaScript: The Good Parts, author Douglas Crockford focuses on the basics of some of the lesser-known yet desirable aspects of JavaScript. It’s only recently that these hidden features are getting the appreciation they deserve from the programming community.', 40),
	('04426a01-140a-4332-a58d-841bcf5ef2d8', 'Learn JavaScript VISUALLY', 'For newbies wishing to quickly grasp the basics of JavaScript, Learn JavaScript VISUALLY the ideal book to go for. The book makes understanding the basic JS concepts easier by means of a visual approach, hence the name.', 50),
	('e6b6c76f-0c01-455e-8318-0ad3089023fd', 'JavaScript: The Definitive Guide', 'Another beginner-friendly JavaScript book is the JavaScript: The Definitive Guide. Anyone interested in building powerful web applications must go through the comprehensive JS book. It explores several JS and web platform API features aimed at web application development.', 60),
	('a0fbc52f-175e-4340-9223-87f25279d8b9', 'Effective JavaScript: 68 Specific Ways to Harness the Power of JavaScript', 'Anyone who has an ample understanding of the JS basics qualifies to gain the most out of Effective JavaScript: 68 Specific Ways to Harness the Power of JavaScript. The JavaScript book takes its readers on an in-depth tour of the high-level, interpreted programming language.', 70),
	('b4bb25f0-e429-48c4-9793-a0b803113bde', 'JavaScript for Kids: A Playful Introduction to Programming', 'The name of the book kind of puns on those that are new to the world of programming. JavaScript for Kids: A Playful Introduction to Programming offers a fanciful exploration of the various basic programming concepts.', 80),
	('0d50ef7d-8006-4891-a882-9d0639149fa3', 'Programming JavaScript Applications: Robust Web Architecture with Node, HTML5, and Moderns JS Libraries', 'Unlike other JS books that answer the question, “How do I use JavaScript?” Programming JavaScript Applications: Robust Web Architecture with Node, HTML5, and Modern JS Libraries answers, “How do I use JavaScript to build a real-world application?”', 90),
	('100307b2-834d-4296-a41b-338d00014a08', 'High-Performance Browser Networking', 'Application performance is something that everyone, ranging from independent developers to full-fledged organizations, crave for. High-Performance Browser Networking is the ultimate guide for building a successful JavaScript application with highly optimized performance.', 100)
	on conflict do nothing;
	
insert into stocks select id, floor(random() * 10 + 1)::int from products on conflict do nothing;
