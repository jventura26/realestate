-- Las consultas de las propiedades importadas iban al asesor externo que venía en los datos de origen.
-- Todas pasan a Zona-INNmueble (WhatsApp 4554-2088) y se elimina el registro del asesor externo.
UPDATE agencies SET whatsapp = '50245542088' WHERE slug = 'zona-innmueble';
UPDATE properties SET agent_id = NULL WHERE agent_id IN (SELECT id FROM agents WHERE name = 'Zoraida Quintana');
DELETE FROM agents WHERE name = 'Zoraida Quintana';
