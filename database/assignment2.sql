-- 1 The Tony Stark insert SQL statement works.

 INSERT INTO public.account (account_firstname,account_lastname,account_email,account_password)
 VALUES ('Tony','Stark','tony@starkent.com','Iam1ronM@n');


-- 2 The Tony Stark update SQL statement works.

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- 3 Delete the Tony Stark record from the database.

DELETE 
from public.account
WHERE account_id = 1;

-- 4 Modify the "GM Hummer" record 

UPDATE public.inventory 
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
where inv_make = 'GM' and inv_model = 'Hummer';

-- 5 Use an inner join

Select cla.classification_name, inv.inv_make, inv.inv_model
from public.inventory inv
inner join public.classification cla on cla.classification_id = inv.classification_id
where cla.classification_name = 'Sport';

-- 6 add "/vehicles"

UPDATE public.inventory 
SET 
inv_image = REPLACE(inv_image, '/images', '/images/vehicles') ,
inv_thumbnail = REPLACE(inv_thumbnail , '/images', '/images/vehicles');

