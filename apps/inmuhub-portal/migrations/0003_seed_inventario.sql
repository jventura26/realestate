-- Generado por scripts/import-wix-json.mjs — inventario inicial de Zona-INNmueble
INSERT OR IGNORE INTO agencies (name, slug, plan, verified) VALUES ('Zona-INNmueble', 'zona-innmueble', 'agencia_pro', 1);
INSERT INTO agents (agency_id, name, whatsapp) SELECT id, 'Zoraida Quintana', '50247692366' FROM agencies WHERE slug = 'zona-innmueble';
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('zona13-elgin', 'Residencia Exclusiva en Elgin | Zona 13', 'publicada', 0, 'venta', 'casa', 'zona-13', 'Zona 13 Ciudad de Guatemala', 'Guatemala', 585000, 'USD', 4504500, 300, NULL, 3, 3, 2, 2, 'Residencia Exclusiva en Venta en Zona 13 dentro de Condominio Privado

Ubicada dentro de un exclusivo condominio en Zona 13, esta elegante residencia combina amplitud, privacidad y una distribución diseñada para disfrutar cada espacio con comodidad y funcionalidad.

Con 300 m² de construcción, la propiedad ofrece ambientes iluminados, áreas sociales integradas y una conexión armoniosa entre los espacios interiores y exteriores, creando el entorno ideal para la vida familiar.

Distribución de la propiedad:

Elegante vestíbulo de ingreso
Amplia sala principal
Comedor integrado
Cocina con excelente distribución
Comedor y cocina con acceso directo a pérgola y jardín
Clóset de blancos
Habitación principal
Baño privado
Doble walk-in closet
Habitación secundaria 1
Baño privado
Closet
Habitación secundaria 2
Baño privado
Closet
Sala familiar con baño completo
Pérgolas laterales ideales para reuniones, descanso y entretenimiento

La propiedad destaca por su diseño funcional, amplios espacios y ubicación privilegiada dentro de uno de los sectores residenciales más buscados de Ciudad de Guatemala.

Una excelente oportunidad para quienes buscan seguridad, comodidad y una inversión patrimonial sólida.

Contáctanos para recibir más información o coordinar una visita privada.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Condominio cerrado","Cámaras de seguridad","Pozo propio","Luz 110v/220v","Pérgola","Terraza exterior","Cocina equipada","Cuarto de servicio con baño","Bodega","Sala familiar","Lavandería interna","Alta plusvalía","Papelería en orden","Sin gravámenes","Negociable"]', '["https://ik.imagekit.io/Zona/CV-+1-0034-CES/4.jpeg?updatedAt=1781413513965","https://ik.imagekit.io/Zona/CV-+1-0034-CES/7.jpeg?updatedAt=1781413513897","https://ik.imagekit.io/Zona/CV-+1-0034-CES/5.jpeg?updatedAt=1781413513936","https://ik.imagekit.io/Zona/CV-+1-0034-CES/3.jpeg?updatedAt=1781413513858","https://ik.imagekit.io/Zona/CV-+1-0034-CES/2.jpeg?updatedAt=1781413513911","https://ik.imagekit.io/Zona/CV-+1-0034-CES/9.jpeg?updatedAt=1781413513880","https://ik.imagekit.io/Zona/CV-+1-0034-CES/8.jpeg?updatedAt=1781413513870","https://ik.imagekit.io/Zona/CV-+1-0034-CES/10.jpeg?updatedAt=1781413513934"]', NULL, NULL, 14.5801, 90.5306, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '17812705639773', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('elsocorro', 'Residencia exclusiva | El Socorro', 'publicada', 0, 'venta', 'casa', 'santa-catarina-pinula', 'Santa Catarina Pinula', 'Santa Catarina Pinula', 310000, 'USD', 2387000, 176, 378, 3, 2, 2, 2, 'Casa en venta en El Socorro

Precio de venta: US$310,000.00 — Negociable
Diseño | Amplitud | Confort residencial

Residencia en venta en El Socorro, diseñada para brindar una experiencia residencial cómoda, funcional y privada.

Con 176 m² de construcción, esta propiedad combina ambientes amplios, áreas sociales integradas, iluminación natural y espacios pensados para una vida familiar moderna y sofisticada.

Características principales

Ubicación: El Socorro
Construcción: 176 m²
Parqueo: 2 vehículos
Habitaciones: 3 + dormitorio de servicio
Baños: Habitaciones con baño privado
Cisterna
Pozo de agua
Portón eléctrico
Precio de venta: US$310,000.00
Negociable

Área social y funcional

Sala principal
Ambiente cómodo para recibir visitas o compartir en familia.

Comedor
Espacio integrado para reuniones familiares y momentos cotidianos.

Cocina
Área funcional para el uso diario del hogar.

Área de lavandería
Espacio independiente para mayor comodidad.

Dormitorio de servicio con baño
Área de apoyo funcional dentro de la propiedad.

Patio interior
Ambiente que aporta ventilación, luz natural y conexión interna.

Baño de visitas
Ubicado estratégicamente para el área social.

Sótano multifuncional

Sótano con baño
Espacio ideal para área social, estudio, oficina privada, sala de entretenimiento o ambiente multifuncional.

Este nivel aporta versatilidad y permite adaptar la propiedad según las necesidades de la familia.

Área familiar

Dormitorio principal
Habitación amplia con walk-in closet y baño privado.

Walk-in closet
Espacio funcional para organización y almacenamiento.

Terraza privada
Un ambiente exterior ideal para descanso, lectura o momentos de privacidad.

Dormitorio secundario con baño y closet
Espacio cómodo e independiente.

Dormitorio secundario amplio con baño y closet
Ambiente adicional con privacidad y buena funcionalidad.

Dos salas familiares
Áreas ideales para descanso, convivencia diaria o entretenimiento familiar.

Equipamiento y extras

Parqueo para 2 vehículos
Comodidad para el uso diario.

Cisterna
Respaldo importante para abastecimiento de agua.

Pozo de agua
Valor adicional para autonomía y funcionalidad.

Portón eléctrico
Mayor comodidad y control de acceso.

Valor diferencial

Diseño cómodo y funcional
Una residencia pensada para aprovechar cada espacio del hogar.

Sótano con baño y uso flexible
Ideal para oficina, área social, estudio o espacio de entretenimiento.

Terraza privada y patio interior
Ambientes que aportan luz, ventilación y privacidad.

Dos salas familiares
Mayor comodidad para la vida diaria y convivencia familiar.

Cisterna y pozo de agua
Elementos clave que fortalecen la funcionalidad de la propiedad.

Información financiera

Precio de venta: US$310,000.00
Negociable

Cierre comercial

Esta casa en El Socorro ofrece una combinación atractiva entre diseño, amplitud, privacidad y funcionalidad.

Una propiedad ideal para quienes buscan una residencia bien distribuida, con áreas familiares, espacios multifuncionales y detalles que aportan comodidad para la vida diaria.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para recibir más información o coordinar una visita privada.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Condominio cerrado","Portón eléctrico","Pozo propio","Cisterna","Luz 110v/220v","Parqueo techado","Jardín amplio","Pérgola","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Estudio / Oficina","Sala familiar"]', '["https://ik.imagekit.io/Zona/CV-+1-0033-CES/8M.png?updatedAt=1781413400786","https://ik.imagekit.io/Zona/CV-+1-0033-CES/5M.png?updatedAt=1781413400390","https://ik.imagekit.io/Zona/CV-+1-0033-CES/6M.png?updatedAt=1781413400392","https://ik.imagekit.io/Zona/CV-+1-0033-CES/7M.png?updatedAt=1781413400355","https://ik.imagekit.io/Zona/CV-+1-0033-CES/1M.png?updatedAt=1781413400361","https://ik.imagekit.io/Zona/CV-+1-0033-CES/3M.png?updatedAt=1781413400406","https://ik.imagekit.io/Zona/CV-+1-0033-CES/7.jpeg?updatedAt=1781413400107","https://ik.imagekit.io/Zona/CV-+1-0033-CES/1.jpeg?updatedAt=1781413400152","https://ik.imagekit.io/Zona/CV-+1-0033-CES/8.jpeg?updatedAt=1781413400163","https://ik.imagekit.io/Zona/CV-+1-0033-CES/4.jpeg?updatedAt=1781413400115","https://ik.imagekit.io/Zona/CV-+1-0033-CES/3.jpeg?updatedAt=1781413400102","https://ik.imagekit.io/Zona/CV-+1-0033-CES/2.jpeg?updatedAt=1781413400105"]', NULL, NULL, 14.5777, 90.2943, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '178127056399831', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('manzanillo', 'El Manzanillo | Granja | Mixco', 'publicada', 0, 'venta', 'terreno', 'mixco', 'Guatemala, Mixco', 'Mixco', 1440000, 'GTQ', 1440000, 176, 2457, 2, 2, 2, 2, 'Granja en venta en El Manzanillo, Mixco

Precio de venta: Q1,440,000.00 + timbres y gastos de ley — Negociable
Naturaleza | Amplitud | Potencial de desarrollo

Propiedad en venta en El Manzanillo, Mixco, ubicada en una zona con excelente accesibilidad desde San Lucas y Mixco. Una opción ideal para quienes buscan espacio, naturaleza y potencial de desarrollo en un entorno con carácter.

Esta granja ofrece un terreno amplio, infraestructura funcional y una topografía inclinada que permite evaluar diferentes posibilidades de uso: granja, casa de descanso, proyecto familiar o desarrollo con visión patrimonial.

Características principales

Ubicación: El Manzanillo, Mixco
Área total: 2,457 m²
Frente: 20 metros
Fondo: 136 metros
Topografía: Inclinada, 65% ascendente
Construcción existente: Casa principal + bodega independiente
Precio de venta: Q1,440,000.00
Adicional: timbres y gastos de ley
Negociable

Detalles del terreno

Terreno amplio de 2,457 m²
Espacio ideal para quienes buscan amplitud, privacidad y conexión con la naturaleza.

20 metros de frente
Frente funcional para ingreso, acceso vehicular o diseño del proyecto.

136 metros de fondo
Profundidad que permite aprovechar la propiedad por áreas, niveles o fases.

Topografía inclinada ascendente
Su inclinación del 65% permite aprovechar vistas, diseñar terrazas, áreas escalonadas o un desarrollo arquitectónico con carácter.

Construcciones existentes

Casa principal
Construcción funcional que puede utilizarse como vivienda, casa de descanso o base operativa para un proyecto.

2 habitaciones
Espacios privados para descanso.

Sala
Área social para convivencia.

Comedor
Ambiente práctico para uso diario.

Cocina
Espacio funcional para preparación de alimentos.

2 baños
Distribución cómoda para uso residencial o visitas.

Bodega independiente
Área adicional para almacenamiento, herramientas, equipo o insumos.

Infraestructura y equipamiento

Muro perimetral en toda la propiedad
Aporta privacidad, delimitación y mayor seguridad.

Pozo artesanal
Recurso importante para abastecimiento de agua.

Depósito de agua
Apoyo funcional para almacenamiento y uso dentro de la propiedad.

Fosa séptica
Infraestructura instalada para el manejo sanitario.

Valor y potencial

Amplio terreno con múltiples posibilidades
La propiedad permite analizar distintos usos según el objetivo del comprador.

Ideal para granja o descanso
Un espacio natural para desconectarse, disfrutar privacidad y crear un entorno familiar.

Potencial de desarrollo
La topografía ascendente permite proyectar un diseño escalonado, áreas recreativas o una construcción con vistas.

Accesos funcionales desde San Lucas y Mixco
La conectividad desde dos puntos clave mejora su valor práctico y patrimonial.

Oportunidad a valor de mercado
Una propiedad interesante para compradores que buscan espacio, ubicación y potencial.

Información financiera

Precio de venta: Q1,440,000.00
Adicional: timbres y gastos de ley
Negociable

Cierre comercial

Esta granja en El Manzanillo, Mixco representa una opción atractiva para quienes buscan naturaleza, amplitud y potencial de desarrollo con accesibilidad desde San Lucas y Mixco.

Una propiedad para analizar con visión: terreno amplio, infraestructura existente, topografía aprovechable y posibilidades de uso residencial, recreativo o patrimonial.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Entorno natural y vistas","Cerca de servicios","Vista al valle","Pozo propio","Jardín amplio","Huerto / área de siembra","Bodega","Sala familiar","Cocina abierta","Finca inscrita en Registro","Caminos internos","Zona en crecimiento","Papelería en orden","Negociable","Potencial de desarrollo","Disponibilidad inmediata","Estudio topográfico disponible"]', '["https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/7.jpeg?updatedAt=1781412178941","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/4.jpeg?updatedAt=1781412178930","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/14.jpeg?updatedAt=1781412178882","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/10.jpeg?updatedAt=1781412178835","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/12.jpeg?updatedAt=1781412178820","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/2.jpeg?updatedAt=1781412178787","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/1.jpeg?updatedAt=1781412178814","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/3.jpeg?updatedAt=1781412178796","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/8.jpeg?updatedAt=1781412178741","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/18.jpeg?updatedAt=1781412178740","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/16.jpeg?updatedAt=1781412178722","https://ik.imagekit.io/Zona/CV-+1-0024-SCRIS/17.jpeg?updatedAt=1781412178644"]', NULL, NULL, 14.6083, 90.6607, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781328408249', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('san-jeronimo', 'San Jerónimo, Baja Verapaz', 'publicada', 0, 'venta', 'finca', 'interior', 'San Jeronimo, Baja Verapaz', 'Baja Verapaz', 2800000, 'GTQ', 2800000, 176, 120000, NULL, NULL, 2, 2, 'Terreno en venta en San Jerónimo, Baja Verapaz

Precio de venta: Q2,800,000.00 — Negociable
12 manzanas | Naturaleza | Desarrollo ecológico | Potencial agrícola

Terreno en venta ubicado en jurisdicción de San Jerónimo, Baja Verapaz, con acceso directo sobre carretera principal y un entorno natural con vistas despejadas.

Una propiedad ideal para quienes buscan invertir en tierra, naturaleza y plusvalía, con vocación para proyectos agrícolas, forestales, ecológicos, turísticos o habitacionales con concepto sostenible.

Características principales

Ubicación: San Jerónimo, Baja Verapaz
Área total: 12 manzanas
Acceso: Sobre carretera principal
Entorno: Natural, abierto y con vistas despejadas
Referencia: A pocos minutos de Aldea Santa Bárbara
Servicios: Acceso a servicios cercanos
Papelería: En orden
Precio de venta: Q2,800,000.00
Negociable

Ubicación privilegiada

Sobre carretera principal
Acceso directo que mejora la conectividad y facilita el ingreso a la propiedad.

Entorno natural y vistas despejadas
Ideal para quienes buscan amplitud, privacidad y contacto con la naturaleza.

Cercanía a Aldea Santa Bárbara
Ubicación práctica para mantener conexión con servicios, comunidad y puntos de referencia cercanos.

Características del terreno

12 manzanas de terreno
Amplio espacio para desarrollar proyectos de mayor escala o conservar como inversión patrimonial.

Vocación de uso múltiple
El terreno puede analizarse para desarrollo forestal, ecológico, agrícola, turístico o granjas.

Topografía aprovechable
Permite proyectar distintos tipos de uso según el objetivo del comprador.

Acceso a servicios cercanos
Un punto importante para evaluar factibilidad operativa y desarrollo futuro.

Ideal para

Casa de descanso
Perfecto para crear una residencia privada rodeada de naturaleza.

Proyecto agrícola
Por su amplitud y entorno, puede evaluarse para producción, cultivo o manejo agropecuario.

Desarrollo habitacional con concepto ecológico
Ideal para un proyecto residencial de baja densidad, con enfoque natural y sostenible.

Hotel ecológico o proyecto turístico
Su ubicación, vistas y entorno permiten analizarlo para hospedaje, retiro, turismo rural o experiencia ecológica.

Proyecto forestal o granja
Una alternativa atractiva para quienes buscan tierra productiva o recreativa.

Valor diferencial

Ubicación sobre carretera
Una ventaja clave para accesibilidad, logística y desarrollo.

Entorno natural con potencial
El terreno ofrece amplitud, vistas y una experiencia conectada con la naturaleza.

Zona con proyección de crecimiento
Una propiedad interesante para compradores que buscan tierra con visión patrimonial.

Alta plusvalía
Por su tamaño, ubicación y vocación de uso, representa una opción atractiva para inversión a mediano y largo plazo.

Papelería en orden
Mayor claridad para avanzar en el análisis y proceso de compra.

Información financiera

Precio de venta: Q2,800,000.00
Negociable

Cierre comercial

Este terreno de 12 manzanas en San Jerónimo, Baja Verapaz es una excelente opción para quienes buscan invertir en naturaleza, ubicación estratégica y potencial de desarrollo.

Una propiedad amplia, con acceso sobre carretera y múltiples posibilidades para proyectos agrícolas, ecológicos, turísticos o habitacionales con concepto natural.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Entorno natural y vistas","Cerca de servicios","Acceso pavimentado","Agua de nacimiento","Caminos internos","Zona en crecimiento","Papelería en orden","Negociable","Potencial de desarrollo","Disponibilidad inmediata"]', '["https://ik.imagekit.io/Zona/TV-D-0001-San%20Jeronimo,%20Alta%20Verapaz/4.jpeg?updatedAt=1781409138174","https://ik.imagekit.io/Zona/TV-D-0001-San%20Jeronimo,%20Alta%20Verapaz/6.jpeg?updatedAt=1781409138095","https://ik.imagekit.io/Zona/TV-D-0001-San%20Jeronimo,%20Alta%20Verapaz/8.jpeg?updatedAt=1781409137772","https://ik.imagekit.io/Zona/TV-D-0001-San%20Jeronimo,%20Alta%20Verapaz/2.jpeg?updatedAt=1781409137844","https://ik.imagekit.io/Zona/TV-D-0001-San%20Jeronimo,%20Alta%20Verapaz/9.jpeg?updatedAt=1781409137778","https://ik.imagekit.io/Zona/TV-D-0001-San%20Jeronimo,%20Alta%20Verapaz/1.jpeg?updatedAt=1781409137772"]', NULL, NULL, 15.103, 90.3181, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781496468384', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('asuncion-mita', 'Casa en venta en Asunción Mita, Jutiapa', 'publicada', 0, 'venta', 'casa', 'interior', 'Asuncion Mita Jutiapa', 'Jutiapa', 650000, 'GTQ', 650000, 120, NULL, 3, 2, 2, 1, 'Casa en venta en Asunción Mita, Jutiapa

Encuentra el hogar que siempre soñaste
3 habitaciones | Jardín | Parqueo | Entorno familiar

Esta casa en Asunción Mita, Jutiapa es una excelente opción para quienes buscan un hogar cómodo, funcional y con espacios pensados para la vida familiar.

Ubicada en una zona con ambiente tranquilo y residencial, la propiedad ofrece una distribución ideal para quienes desean vivir con mayor privacidad, disfrutar áreas verdes y contar con parqueo propio.

Características principales

Ubicación: Asunción Mita, Jutiapa
Habitaciones: 3
Área exterior: Jardín
Parqueo: Disponible
Tipo de propiedad: Casa familiar
Estilo: Moderno, cómodo y funcional

Una casa pensada para disfrutar cada día

Esta propiedad combina diseño, comodidad y practicidad para una familia que busca establecerse en un entorno residencial agradable.

Sus espacios permiten disfrutar una vida diaria cómoda, con áreas ideales para descanso, convivencia familiar y momentos al aire libre.

Jardín y ambiente familiar

El jardín aporta frescura, amplitud y un espacio perfecto para compartir en familia, tener mascotas o crear un área exterior personalizada.

Una casa ideal para quienes valoran la tranquilidad, la privacidad y un entorno con sensación de hogar.

Valor diferencial

Ubicación en Asunción Mita, Jutiapa
Una zona con crecimiento, conectividad y ambiente residencial.

3 habitaciones funcionales
Espacios ideales para familia, visitas o área de trabajo en casa.

Jardín privado
Un valor importante para quienes buscan área exterior dentro de su hogar.

Parqueo propio
Comodidad y seguridad para el uso diario.

Potencial patrimonial
Una propiedad para analizar con visión familiar y de inversión.

Cierre comercial

Esta casa en Asunción Mita, Jutiapa representa una opción atractiva para quienes buscan comprar con claridad, en una ubicación con potencial y con espacios que se adaptan a la vida familiar.

En Zona-INNmueble no se trata de vender por vender.
Te ayudamos a evaluar ubicación, precio, distribución y valor para que tomes una mejor decisión inmobiliaria.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Solicita más información para conocer detalles, precio y disponibilidad.', '["Entorno natural y vistas","Cerca de servicios","Acceso pavimentado","Agua municipal","Luz 110v/220v","Parqueo descubierto","Jardín amplio","Cocina equipada","Sala familiar","Zona en crecimiento","Papelería en orden","Negociable","Potencial de desarrollo","Disponibilidad inmediata"]', '["https://ik.imagekit.io/Zona/Casa%20Mita/2.jpeg?updatedAt=1781414921639","https://ik.imagekit.io/Zona/Casa%20Mita/1.jpeg?updatedAt=1781414921372"]', NULL, NULL, 14.3332, 89.7125, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781497255720', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('finca-chimaltenango', 'Finca en Chimaltenango', 'publicada', 0, 'venta', 'finca', 'interior', 'Chimaltenango', NULL, 50000000, 'GTQ', 50000000, NULL, NULL, NULL, NULL, NULL, NULL, 'Finca con potencial de urbanización, acceso estratégico
y visión de largo plazo para inversionistas y desarrolladores.', '[]', '["https://ik.imagekit.io/Zona/Foto%20Chimaltenango.png"]', NULL, NULL, NULL, NULL, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), NULL, 'import-wix', '1781570148310', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('kanajuyu-16', 'Casa en Kanajuyú | Zona 16', 'publicada', 0, 'venta', 'casa', 'zona-16', NULL, 'Guatemala', 625000, 'USD', 4812500, 562, 700, 4, 4, NULL, NULL, 'Casa en venta en Kanajuyú, Zona 16

Precio de venta: US$625,000.00 — Negociable

Exclusividad, amplitud y entorno natural en una de las zonas más privilegiadas de Ciudad de Guatemala.

Ubicada dentro de garita con seguridad, esta residencia destaca por su diseño amplio, iluminación natural y conexión con áreas verdes. Es una propiedad ideal para quienes buscan privacidad, confort y un estilo de vida superior en Kanajuyú, Zona 16.

Características principales

Ubicación: Kanajuyú, Zona 16

Precio de venta: US$625,000.00
Precio negociable
Seguridad: Garita y acceso controlado
Entorno: Residencial, natural y privado

Exterior y accesos

Parqueo para hasta 6 vehículos
Capacidad amplia de parqueo, con espacio para 3 vehículos bajo techo.

4 portones eléctricos
Mayor comodidad, seguridad y control de acceso.

Puerta peatonal blindada
Un detalle adicional de protección para el ingreso principal.

Garita y seguridad
Ubicada dentro de un entorno residencial con control de acceso.

Primer nivel — Espacios sociales y entretenimiento

Man cave / cuarto de juegos
Espacio ideal para entretenimiento, reuniones o área privada de descanso.

Estudio privado
Perfecto para oficina en casa, lectura o trabajo independiente.

Baño de visitas
Ubicado estratégicamente para el área social.

Sala principal con chimenea
Un ambiente amplio y acogedor, ideal para reuniones familiares o sociales.

Comedor con salida directa al jardín
Conexión práctica entre el área social y los espacios exteriores.

Cocina amplia con despensa
Diseñada para funcionalidad, almacenamiento y comodidad diaria.

Pantry con acceso al jardín
Un espacio práctico que conecta con el área exterior.

Jardín rodeado de naturaleza
Área verde que aporta privacidad, frescura y una experiencia residencial superior.

Piscina privada
Ideal para disfrutar momentos de descanso, convivencia y recreación en casa.

Área de lavandería
Espacio independiente y funcional.

Área de servicio
Diseñada para mayor comodidad operativa dentro de la residencia.

Segundo nivel — Área familiar

Sala familiar con chimenea
Ambiente amplio y acogedor para compartir momentos privados en familia.

4 habitaciones en total
Distribución ideal para familias que buscan comodidad, privacidad y amplitud.

Master suite
Habitación principal con baño privado, jetina y regadera.

Walk-in closet
Espacio amplio y funcional para almacenamiento privado.

2 habitaciones secundarias
Ambas con clósets de pared y acceso a baño compartido.

Baño compartido con doble regadera
Diseñado para mayor comodidad en el uso diario.

4ta habitación con baño privado
Ideal para visitas, familiar independiente o habitación adicional con mayor privacidad.

Detalles adicionales

Calentador de paso en cada baño y cocina
Un detalle práctico que mejora la comodidad diaria de la residencia.

Conexión con naturaleza
La propiedad ofrece espacios abiertos, jardín y áreas verdes que elevan la experiencia de vida.

Diseño amplio y funcional
Ideal para quienes valoran privacidad, comodidad y una distribución pensada para vivir mejor.

Información financiera

Precio de venta: US$625,000.00
Negociable

Cierre comercial

Esta casa en Kanajuyú, Zona 16 no solo ofrece amplitud y ubicación privilegiada. Ofrece una experiencia residencial completa: seguridad, privacidad, naturaleza, piscina, espacios sociales y áreas familiares diseñadas para disfrutar cada día con comodidad.

Una propiedad ideal para quienes buscan vivir en una de las zonas más exclusivas de Ciudad de Guatemala, con visión patrimonial y calidad de vida.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Agenda una visita privada y conoce esta residencia.', '["Entorno natural y vistas","Cerca de servicios","Negociable"]', '["https://ik.imagekit.io/Zona/CV-+1-0020-z16/11.jpeg?updatedAt=1781412018171","https://ik.imagekit.io/Zona/CV-+1-0020-z16/5.jpeg?updatedAt=1781412018049","https://ik.imagekit.io/Zona/CV-+1-0020-z16/9.jpeg?updatedAt=1781412018054","https://ik.imagekit.io/Zona/CV-+1-0020-z16/1.jpeg?updatedAt=1781412018031","https://ik.imagekit.io/Zona/CV-+1-0020-z16/7.jpeg?updatedAt=1781412017997","https://ik.imagekit.io/Zona/CV-+1-0020-z16/8.jpeg?updatedAt=1781412018007","https://ik.imagekit.io/Zona/CV-+1-0020-z16/3.jpeg?updatedAt=1781412018012","https://ik.imagekit.io/Zona/CV-+1-0020-z16/10.jpeg?updatedAt=1781412018053","https://ik.imagekit.io/Zona/CV-+1-0020-z16/6.jpeg?updatedAt=1781412017988"]', NULL, NULL, 14.6349, 90.5069, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), NULL, 'import-wix', '1781849517284', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('hacienda-nueva', 'Hacienda Nueva Country Club | San Jose Pinula', 'publicada', 0, 'venta', 'casa', 'san-jose-pinula', 'Carretera San Jose Pinula', 'San José Pinula', 590000, 'USD', 4543000, NULL, 2048, 3, 2, 4, 2, 'Casa estilo colonial en entorno exclusivo

Precio de venta: US$590,000.00

Vive en un lugar exclusivo, rodeado de naturaleza, bienestar y amplitud.
Esta residencia de estilo colonial ha sido diseñada para quienes buscan comodidad, privacidad y un estilo de vida superior.

Ubicada en un entorno residencial con amenidades de alto nivel, incluyendo campo de golf, casa club y salón para eventos especiales, esta propiedad es ideal para familias que desean vivir con tranquilidad y disfrutar del buen vivir.

Características principales

Estilo: Colonial
Ambiente: Exclusivo, natural y residencial
Amenidades: Golf, casa club y salón para eventos
Ideal para: Familias que buscan amplitud, bienestar y calidad de vida
Precio: US$590,000.00

Primer nivel

Sala
Espacio social amplio para recibir visitas y disfrutar en familia.

Comedor
Área integrada para reuniones familiares y momentos especiales.

Baño de visitas
Ubicado estratégicamente para el área social.

Patio interior con jardinera y fuente
Un detalle arquitectónico que aporta frescura, luz natural y elegancia.

Dos pérgolas
Perfectas para disfrutar espacios exteriores con sombra y privacidad.

Jardín
Área verde ideal para descanso, convivencia y actividades al aire libre.

Cocina
Funcional y bien distribuida para el uso diario.

Despensa y pantry
Espacios adicionales para organización y comodidad.

Estudio
Ideal para oficina en casa, lectura o área privada de trabajo.

Lavandería
Área independiente para mayor funcionalidad.

Cuarto de servicio con baño
Espacio práctico para apoyo doméstico.

Patio de tender
Área ventilada y funcional.

Garage para 4 vehículos
Dos vehículos bajo techo y dos adicionales sin techo.

Bodega
Espacio extra para almacenamiento.

Segundo nivel

Habitación principal
Cuenta con walk-in closet, baño, chimenea, balcón e instalación para jacuzzi.

Dos habitaciones secundarias
Ambas con closet y baño compartido.

Sala familiar amplia
Con chimenea y salida a balcón, ideal para compartir momentos privados en familia.

Balcón
Espacio perfecto para disfrutar vistas, aire fresco y tranquilidad.

Amenidades del entorno

Campo de golf
Un diferencial exclusivo para quienes valoran el deporte, la naturaleza y el estilo de vida residencial.

Casa club
Espacio social para disfrutar con familia, amigos o vecinos.

Salón para eventos especiales
Ideal para reuniones, celebraciones y actividades privadas.

Entorno natural
Un ambiente diseñado para vivir con calma, bienestar y amplitud.

Información financiera

Precio de venta: US$590,000.00
Mantenimiento: Q882.00 mensuales
IUSI: Q1,158.72 trimestral

Cierre comercial

Esta propiedad no solo ofrece una casa amplia. Ofrece un estilo de vida en un entorno exclusivo, con naturaleza, amenidades y espacios diseñados para disfrutar cada etapa familiar.

Una opción ideal para quienes buscan comprar con visión patrimonial, comodidad y calidad de vida.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Agenda una visita privada y conoce esta residencia.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Cámaras de seguridad","Sistema de alarma","Pozo propio","Luz 110v/220v","Parqueo techado","Piscina","Jardín amplio","Pérgola","Terraza exterior","Huerto / área de siembra","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Chimenea"]', '["https://ik.imagekit.io/Zona/CV-BS-0008-CES/9.jpeg?updatedAt=1781357832238","https://ik.imagekit.io/Zona/CV-BS-0008-CES/7.jpeg?updatedAt=1781357832313","https://ik.imagekit.io/Zona/CV-BS-0008-CES/8.jpeg?updatedAt=1781357832234","https://ik.imagekit.io/Zona/CV-BS-0008-CES/11.jpeg?updatedAt=1781357832151","https://ik.imagekit.io/Zona/CV-BS-0008-CES/5.jpeg?updatedAt=1781357832129","https://ik.imagekit.io/Zona/CV-BS-0008-CES/4.jpeg?updatedAt=1781357832153","https://ik.imagekit.io/Zona/CV-BS-0008-CES/12.jpeg?updatedAt=1781357832140","https://ik.imagekit.io/Zona/CV-BS-0008-CES/13.jpeg?updatedAt=1781357832081","https://ik.imagekit.io/Zona/CV-BS-0008-CES/14.jpeg?updatedAt=1781357832199","https://ik.imagekit.io/Zona/CV-BS-0008-CES/2.jpeg?updatedAt=1781357832104","https://ik.imagekit.io/Zona/CV-BS-0008-CES/6.jpeg?updatedAt=1781357832047","https://ik.imagekit.io/Zona/CV-BS-0008-CES/10.jpeg?updatedAt=1781357832032"]', NULL, NULL, 14.538, 90.3952, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781870175127', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('villas-alcala', 'Villas de Alcalá, Km.16.5, Carretera a El Salvador', 'publicada', 0, 'venta', 'casa', 'carretera-el-salvador', 'Carretera a El Salvador', 'Fraijanes', 270000, 'USD', 2079000, 300, NULL, 3, 2, 2, 2, 'Proyecto residencial con naturaleza, bienestar y amplitud

Precios de venta desde US$270,000.00 hasta US$390,000.00

Más que un proyecto inmobiliario, esta es una invitación a experimentar la vida en su máxima plenitud, dentro de un entorno natural, acogedor y diseñado para disfrutar cada etapa de la vida familiar.

Ubicado cerca de colegios, universidades y plazas comerciales, este desarrollo combina comodidad, conectividad y amenidades pensadas para un estilo de vida moderno, funcional y familiar.

Modelos disponibles
Casa Sevilla

Área de construcción: 240 m²
Ideal para familias que buscan una casa amplia, funcional y con jardín generoso.

Casa Asturias

Área de construcción: 300 m²
Una opción con mayor amplitud, más parqueos y espacios diseñados para quienes buscan comodidad superior.

Amenidades del proyecto

Casa club para 100 personas
Espacio ideal para reuniones familiares, actividades sociales o eventos especiales. Cuenta con cocineta, alacena, muebles para almacenaje y baños independientes para hombres y mujeres.

Coworking Center
Área diseñada para trabajar o reunirse con comodidad. Incluye sala, mesa para reuniones, televisión, estación de café y baño.

Game Center
Espacio recreativo con mesa de ping pong, mesa de futillo, televisión y sillones tipo puff para compartir en familia o con amigos.

Sala de belleza
Ambiente práctico con mesa para uñas y mueble tocador para estilista.

Área pet friendly
Espacio pensado para mascotas, con pileta para bañar perros, área de juegos cercada y bebedero.

Área verde familiar
Cuenta con juegos infantiles, cama elástica y área para piñatas, ideal para niños y actividades al aire libre.

Nota: Fotografías de referencia.

Casa Sevilla — 240 m²
Primer nivel

Garage techado para 2 vehículos
Comodidad y protección para el parqueo diario.

Entrada principal y entrada de servicio
Diseñadas para mayor funcionalidad y circulación independiente.

Baño de visitas
Ubicado estratégicamente para el área social.

Sala principal
Espacio amplio para recibir visitas y compartir en familia.

Comedor
Área ideal para reuniones familiares y momentos especiales.

Porche
Un espacio de transición que aporta amplitud y carácter residencial.

Cocina con gabinetes
Funcional, práctica y lista para el uso diario.

Despensa
Área adicional para almacenamiento y organización.

Lavandería
Espacio independiente para mayor comodidad.

Patio
Área funcional con ventilación natural.

Jardín trasero de 95.10 m²
Un espacio amplio para disfrutar al aire libre, ideal para familia, mascotas o reuniones.

Cuarto de servicio con baño completo
Área de apoyo independiente y funcional.

Segundo nivel

Habitación máster
Cuenta con baño completo, balcón y walk-in closet.

Dos habitaciones secundarias
Cada una con closet, baño compartido y balcón individual.

Sala familiar
Espacio cómodo para compartir momentos privados en familia.

Estudio
Ideal para oficina en casa, lectura o área académica.

Casa Asturias — 300 m²
Primer nivel

Garage techado para 4 vehículos
Mayor capacidad de parqueo, ideal para familias con varios vehículos o visitas.

Entrada principal y entrada de servicio
Separación práctica entre acceso social y acceso operativo.

Baño de visitas
Funcional para el área social.

Sala principal
Ambiente amplio y elegante para convivencia familiar o social.

Comedor
Espacio ideal para compartir comidas, reuniones y celebraciones.

Pérgola
Área exterior techada para disfrutar reuniones o momentos de descanso.

Cocina con gabinetes y desayunador
Diseñada para combinar funcionalidad, almacenamiento y comodidad diaria.

Despensa
Espacio adicional para mantener la cocina organizada.

Lavandería
Área independiente para labores del hogar.

Patio
Espacio práctico con ventilación natural.

Jardín trasero de 140 m²
Amplio jardín para disfrutar con familia, niños, mascotas o actividades sociales.

Cuarto de servicio con baño completo
Ambiente independiente para apoyo doméstico.

Segundo nivel

Habitación máster
Cuenta con baño completo, balcón y walk-in closet.

Dos habitaciones secundarias
Cada una con closet, baño compartido y balcón individual.

Sala familiar
Ambiente privado y cómodo para descanso o convivencia.

Estudio
Espacio ideal para oficina en casa, lectura o área de trabajo.

Información financiera

Precios de venta desde: US$270,000.00 hasta US$390,000.00

Cierre comercial

Este proyecto es ideal para quienes buscan una residencia amplia, funcional y rodeada de amenidades que elevan la calidad de vida.

Más que una casa, ofrece un entorno pensado para vivir con comodidad, naturaleza, seguridad y bienestar familiar.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Solicita información privada y agenda una visita.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Acceso pavimentado","Garita 24/7","Condominio cerrado","Cámaras de seguridad","Portón eléctrico","Pozo propio","Parqueo techado","Jardín amplio","Área de BBQ","Pérgola","Terraza exterior","Juegos infantiles","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Estudio / Oficina"]', '["https://ik.imagekit.io/Zona/CV-MM-0001-CES/8.jpeg?updatedAt=1781414726035","https://ik.imagekit.io/Zona/CV-MM-0001-CES/2.jpeg?updatedAt=1781414725715","https://ik.imagekit.io/Zona/CV-MM-0001-CES/3.jpeg?updatedAt=1781414725768","https://ik.imagekit.io/Zona/CV-MM-0001-CES/5.jpeg?updatedAt=1781414725700","https://ik.imagekit.io/Zona/CV-MM-0001-CES/7.jpeg?updatedAt=1781414725742","https://ik.imagekit.io/Zona/CV-MM-0001-CES/4.jpeg?updatedAt=1781414725704","https://ik.imagekit.io/Zona/CV-MM-0001-CES/6.jpeg?updatedAt=1781414725666","https://ik.imagekit.io/Zona/CV-MM-0001-CES/10.jpeg?updatedAt=1781414725591","https://ik.imagekit.io/Zona/CV-MM-0001-CES/9.jpeg?updatedAt=1781414725546"]', NULL, NULL, 14.5318, 90.4654, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781871948082', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('san-cristobal', 'San Cristóbal | Casa en Venta | B-7', 'publicada', 0, 'venta', 'casa', 'san-cristobal', 'Zona 8 de Mixco', 'Mixco', 2500000, 'GTQ', 2500000, 405, NULL, 5, 4, 3, 2, 'Casa en venta en San Cristóbal B-7, Zona 8 de Mixco

Precio de venta: Q2,500,000.00 + timbres y gastos de ley — Negociable

Residencia amplia, funcional y con vista al valle, ubicada en calle cerrada con garita en una de las zonas más consolidadas de San Cristóbal, Zona 8 de Mixco.

Esta propiedad es ideal para quienes buscan seguridad, amplitud, espacios bien distribuidos y una excelente vista en un entorno residencial con cercanía a supermercados, restaurantes y centros educativos.

Características principales

Ubicación: San Cristóbal B-7, Zona 8 de Mixco
Terreno: 356 m²
Medidas del terreno: 14 x 28 metros
Construcción: 405 m²
Garage: Techado para 3 vehículos
Seguridad: Calle cerrada con garita
Vista: Vista privilegiada al valle
Precio de venta: Q2,500,000.00
Precio negociable
Gastos: + timbres y gastos de ley

Primer nivel — Área social y funcional

Estudio o dormitorio con baño completo
Espacio versátil que puede funcionar como oficina, habitación para visitas o dormitorio en primer nivel.

Baño de visitas
Ubicado estratégicamente para el área social.

Cocina amplia de 3 x 6 metros
Diseñada para comodidad diaria, con excelente espacio de trabajo.

Gabinetes fundidos y madera sólida
Detalle de calidad que aporta durabilidad y carácter a la cocina.

Área de lavandería y patio
Espacios funcionales para el manejo del hogar.

Cisterna con bomba hidroneumática
Sistema práctico para abastecimiento y presión de agua.

Conexión GLP
Instalación funcional para gas.

Comedor amplio de 6 x 5 metros
Ideal para reuniones familiares y momentos especiales.

Sala con chimenea funcional
Ambiente acogedor y amplio para compartir en familia o recibir visitas.

Jardín de 9 x 10 metros
Espacio exterior ideal para descanso, convivencia y actividades al aire libre.

Pérgola con churrasquera
Área perfecta para reuniones, asados y entretenimiento familiar.

Apartamento independiente

Sala
Área social privada e independiente.

Dormitorio con clóset
Espacio cómodo para habitación adicional, visita o renta.

Baño privado
Funcionalidad completa para uso independiente.

Ideal para: visitas, familiar independiente, oficina privada o potencial de renta.

Segundo nivel — Área familiar

Sala familiar
Ambiente privado para convivencia diaria.

Dormitorio principal
Espacio amplio con baño privado y vista privilegiada.

Baño privado
Comodidad y privacidad para la habitación principal.

Bay window con vista al valle
Un detalle arquitectónico que permite disfrutar luz natural y una vista especial.

Dormitorio secundario con baño privado y terraza
Habitación adicional con mayor privacidad y salida a terraza.

2 dormitorios secundarios adicionales
Espacios funcionales para familia, visitas o áreas complementarias.

Baño compartido
Ubicado para servicio de los dormitorios secundarios.

Valor diferencial

Vista privilegiada al valle
Uno de los atributos más atractivos de la propiedad.

Espacios amplios y bien distribuidos
Diseñada para familias que valoran comodidad, funcionalidad y amplitud.

Apartamento independiente
Un diferencial ideal para renta, visitas, oficina o familiar independiente.

Ubicación en garita con seguridad
Mayor tranquilidad y control de acceso.

Cercanía a servicios clave
Próxima a supermercados, restaurantes y centros educativos.

Información financiera

Precio de venta: Q2,500,000.00
Adicional: timbres y gastos de ley
Negociable

Cierre comercial

Esta casa en San Cristóbal B-7, Zona 8 de Mixco ofrece una combinación muy atractiva: amplitud, seguridad, vista al valle, apartamento independiente y una ubicación consolidada cerca de servicios esenciales.

Una propiedad ideal para familias que buscan vivir con comodidad y también para quienes valoran un inmueble con espacios versátiles y potencial adicional.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Solicita información privada y agenda una visita.', '["Ubicación privilegiada","Entorno natural y vistas","Zona residencial exclusiva","Acceso pavimentado","Garita 24/7","Condominio cerrado","Garaje cerrado","Jardín amplio","Pérgola","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Chimenea","Estudio / Oficina","Sala familiar","Lavandería interna","Cocina abierta","Área social / salón de eventos"]', '["https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/8.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/14.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/18.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/6.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/21.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/16.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/3.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/2.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/17.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/19.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/13.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/7.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/20.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/12.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/9.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/4.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/1.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/15.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/5.jpeg","https://ik.imagekit.io/Zona/CV-+1-0025-SCRIS/10.jpeg"]', NULL, NULL, 14.6012, 90.5932, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781872445645', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('santa-rosalia', 'Santa Rosalia Km 12.5 Carretera a El Salvador', 'publicada', 0, 'venta', 'casa', 'carretera-el-salvador', 'Santa Catarina Pinula', 'Santa Catarina Pinula', 650000, 'USD', 5005000, 460, 800, 3, 3, 2, 2, 'Residencia remodelada en Santa Rosalía, km 12.5 Carretera a El Salvador

Precio de venta: US$650,000.00 — Negociable

Residencia completamente remodelada en Santa Rosalía, km 12.5 Carretera a El Salvador, una ubicación estratégica para quienes buscan vivir cerca de la ciudad, con entorno natural, amplitud y privacidad.

Cada detalle de esta propiedad ha sido cuidadosamente renovado: sistema eléctrico, pisos, ventanería, cocina y closets, ofreciendo una casa moderna, funcional y lista para habitar.

Características principales

Ubicación: Santa Rosalía, km 12.5 Carretera a El Salvador
Terreno: 800 varas
Construcción: 460 m²
Habitaciones: 3, cada una con baño privado
Parqueos: 2
Pozo propio
Vista al bosque y entorno natural
Precio de venta: US$650,000.00
Precio negociable
Sin gravámenes

Remodelación completa

Sistema eléctrico renovado
Una mejora clave para mayor seguridad, funcionalidad y tranquilidad.

Pisos renovados
Acabados actualizados que aportan una imagen moderna y limpia.

Ventanería renovada
Mejor iluminación, ventilación y estética en los ambientes.

Cocina moderna
Diseñada para el uso diario, con una imagen actual y funcional.

Closets renovados
Espacios prácticos y actualizados para mayor organización.

Distribución y ambientes

3 habitaciones con baño privado
Cada dormitorio ofrece mayor comodidad, privacidad e independencia.

Master suite con walk-in closet
Habitación principal amplia, funcional y diseñada para mayor confort.

Sala principal
Espacio social amplio, ideal para recibir visitas o compartir en familia.

Comedor
Área cómoda para reuniones familiares y momentos especiales.

Cocina moderna
Ambiente renovado, práctico y conectado con el estilo actual de la propiedad.

Estudio
Perfecto para oficina en casa, lectura o espacio de trabajo privado.

Sala familiar
Área íntima para convivencia diaria y descanso.

Pérgola y jardín con vista al bosque
Espacio exterior ideal para disfrutar naturaleza, tranquilidad y reuniones al aire libre.

Área de lavandería
Zona funcional e independiente para el manejo del hogar.

Pozo propio
Un valor adicional importante para autonomía y abastecimiento.

Valor diferencial

Vista al bosque y entorno natural
Una propiedad que conecta amplitud, privacidad y naturaleza.

Ambientes amplios e iluminados
Espacios pensados para vivir con comodidad y buena entrada de luz natural.

Lista para habitar
Remodelada en elementos clave, sin necesidad de iniciar trabajos mayores.

Sin gravámenes
Mayor tranquilidad para avanzar en el proceso de compra.

Ubicación estratégica en Carretera a El Salvador
Santa Rosalía, km 12.5, una zona atractiva para quienes buscan cercanía, privacidad y entorno residencial.

Información financiera

Precio de venta: US$650,000.00
Negociable
Propiedad sin gravámenes

Cierre comercial

Esta residencia en Santa Rosalía, km 12.5 Carretera a El Salvador combina ubicación, remodelación completa, amplitud y entorno natural.

Una opción ideal para quienes buscan una propiedad lista para habitar, con vista al bosque, espacios renovados y una ubicación privilegiada en una de las áreas residenciales más buscadas de Guatemala.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Solicita información privada y agenda una visita.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Condominio cerrado","Garaje cerrado","Jardín amplio","Pérgola","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Estudio / Oficina","Sala familiar","Lavandería interna","Cocina abierta","Alta plusvalía","Zona en crecimiento","Papelería en orden"]', '["https://ik.imagekit.io/Zona/CV-+1-0022-CAES/9.jpeg?updatedAt=1781412090695","https://ik.imagekit.io/Zona/CV-+1-0022-CAES/6.jpeg?updatedAt=1781412090694","https://ik.imagekit.io/Zona/CV-+1-0022-CAES/10.jpeg?updatedAt=1781412090622","https://ik.imagekit.io/Zona/CV-+1-0022-CAES/3.jpeg?updatedAt=1781412090639","https://ik.imagekit.io/Zona/CV-+1-0022-CAES/2.jpeg?updatedAt=1781412090619","https://ik.imagekit.io/Zona/CV-+1-0022-CAES/7.jpeg?updatedAt=1781412090562","https://ik.imagekit.io/Zona/CV-+1-0022-CAES/1.jpeg?updatedAt=1781412090560","https://ik.imagekit.io/Zona/CV-+1-0022-CAES/11.jpeg?updatedAt=1781412090518"]', NULL, NULL, 14.5763, 90.4632, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781873536567', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('chulamar', 'Casa Condominio Alta Mar, Puerto de San José, Escuintla', 'publicada', 0, 'venta_renta', 'casa', 'puerto-san-jose', 'Escuintla, Chulamar', 'Escuintla', 330000, 'USD', 2541000, 606.65, 800, 4, 4, 4, 2, 'Casa de playa en venta en Chulamar, Puerto de San José

Precio de venta: US$330,000.00 — Amueblada y equipada

Amplia y linda casa en venta en el puerto, ubicada en el kilómetro 4.5 Carretera a Chulamar, Puerto de San José. Una propiedad diseñada para disfrutar el equilibrio perfecto entre confort, descanso y vida cerca del mar.

Esta residencia ofrece espacios abiertos, piscina privada, áreas sociales y un entorno ideal para compartir con familia y amigos. Su ubicación en una de las zonas más atractivas del litoral pacífico la convierte en una opción interesante para vivir, vacacionar o invertir en renta vacacional tipo Airbnb.

Características principales

Ubicación: Km 4.5 Carretera a Chulamar, Puerto de San José
Tipo de propiedad: Casa de playa
Precio de venta: US$330,000.00
Se vende totalmente amueblada y equipada
Incluye equipo y menaje de la propiedad
Piscina privada: 4.25 x 8 metros
Ideal para: casa familiar de playa, residencia vacacional o inversión en Airbnb
Precio flexible para compradores calificados

Primer nivel

2 habitaciones
Espacios cómodos para descanso familiar o visitas.

2 baños
Un baño para cada habitación, brindando privacidad y funcionalidad.

Sala
Ambiente social integrado para compartir y descansar.

Comedor
Área práctica para reuniones familiares y momentos especiales.

Cocina integrada a sala y comedor
Distribución abierta que conecta los espacios y mejora la convivencia.

Área de estar frente a la piscina
Un ambiente ideal para disfrutar la vista, el clima y la vida al aire libre.

Pérgola con churrasquera
Perfecta para reuniones, asados y convivencia con familia o amigos.

Cuarto de filtro con baño y ducha exterior
Funcional para el área de piscina y uso después de disfrutar el mar o áreas exteriores.

Jardín
Espacio verde que complementa el ambiente de descanso y recreación.

Segundo nivel

Sala amplia
Área adicional para descanso, entretenimiento o convivencia familiar.

Área de hamacas y terraza con vista hacia la piscina
Espacio perfecto para relajarse, descansar y disfrutar el ambiente de playa.

2 habitaciones
Ambientes privados para familia o visitas.

2 baños
Un baño para cada habitación, aportando comodidad y privacidad.

Piscina y áreas exteriores

Piscina privada de 4.25 x 8 metros
Un punto central de la propiedad, ideal para disfrutar con familia, amigos o huéspedes.

Ambiente de descanso cerca del mar
Pensado para quienes buscan desconectarse, vacacionar o generar una experiencia atractiva para renta.

Pérgola y churrasquera
Área social ideal para reuniones y actividades al aire libre.

Beneficios del condominio

2 piscinas sociales con toboganes
Ideales para niños, visitas y actividades familiares.

Acceso privado directo al mar
Un valor diferencial para quienes buscan una experiencia auténtica de playa.

Áreas de recreación
Espacios diseñados para disfrutar en familia y aprovechar mejor cada visita.

Seguridad 24 horas
Mayor tranquilidad para propietarios, familia e invitados.

Información financiera

Precio de venta: US$330,000.00
Incluye muebles, equipo y menaje de la propiedad
Se escuchan propuestas serias de compra
Precio flexible para compradores calificados

Valor de inversión

Esta propiedad es ideal para quienes buscan una casa familiar de playa, una residencia vacacional o una inversión con potencial para Airbnb.

Su ubicación cerca del mar, sus amenidades, la piscina privada y el hecho de venderse completamente amueblada y equipada la convierten en una alternativa lista para disfrutar o rentabilizar.

Cierre comercial

Esta casa de playa en Chulamar, Puerto de San José ofrece una experiencia completa: descanso, privacidad, piscina privada, acceso al mar, amenidades familiares y potencial de inversión.

Una propiedad para quienes desean vivir la experiencia del mar con comodidad, o analizar una inversión vacacional con visión patrimonial.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Solicita información privada y agenda una visita.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Acceso pavimentado","Garita 24/7","Sistema de alarma","Parqueo techado","Piscina","Jardín amplio","Área de BBQ","Pérgola","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Chimenea","Sala familiar","Lavandería interna"]', '["https://ik.imagekit.io/Zona/CV-D-0012-PTO/1.jpg?updatedAt=1781409009152","https://ik.imagekit.io/Zona/CV-D-0012-PTO/15.jpg?updatedAt=1781409009192","https://ik.imagekit.io/Zona/CV-D-0012-PTO/13.jpg?updatedAt=1781409009160","https://ik.imagekit.io/Zona/CV-D-0012-PTO/14.jpg?updatedAt=1781409009051","https://ik.imagekit.io/Zona/CV-D-0012-PTO/10.jpg?updatedAt=1781409009136","https://ik.imagekit.io/Zona/CV-D-0012-PTO/11.jpg?updatedAt=1781409009132","https://ik.imagekit.io/Zona/CV-D-0012-PTO/11.jpg?updatedAt=1781409009132","https://ik.imagekit.io/Zona/CV-D-0012-PTO/22.jpg?updatedAt=1781409009125","https://ik.imagekit.io/Zona/CV-D-0012-PTO/5.jpg?updatedAt=1781409009065","https://ik.imagekit.io/Zona/CV-D-0012-PTO/24.jpg?updatedAt=1781409009054","https://ik.imagekit.io/Zona/CV-D-0012-PTO/18.jpg?updatedAt=1781409008989","https://ik.imagekit.io/Zona/CV-D-0012-PTO/4.jpg?updatedAt=1781409008937","https://ik.imagekit.io/Zona/CV-D-0012-PTO/12.jpg?updatedAt=1781409008965","https://ik.imagekit.io/Zona/CV-D-0012-PTO/8.jpg?updatedAt=1781409008922","https://ik.imagekit.io/Zona/CV-D-0012-PTO/16.jpg?updatedAt=1781409008960","https://ik.imagekit.io/Zona/CV-D-0012-PTO/17.jpg?updatedAt=1781409008988","https://ik.imagekit.io/Zona/CV-D-0012-PTO/6.jpg?updatedAt=1781409008911","https://ik.imagekit.io/Zona/CV-D-0012-PTO/20.jpg?updatedAt=1781409009000","https://ik.imagekit.io/Zona/CV-D-0012-PTO/7.jpg?updatedAt=1781409008881","https://ik.imagekit.io/Zona/CV-D-0012-PTO/21.jpg?updatedAt=1781409008902","https://ik.imagekit.io/Zona/CV-D-0012-PTO/23.jpg?updatedAt=1781409008795","https://ik.imagekit.io/Zona/CV-D-0012-PTO/9.jpg?updatedAt=1781409008892","https://ik.imagekit.io/Zona/CV-D-0012-PTO/19.jpg?updatedAt=1781409008728"]', NULL, NULL, 13.9171, 90.8949, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781874430250', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('fontana3', 'Fontana 3, Carretera a El Salvador', 'publicada', 0, 'venta', 'casa', 'carretera-el-salvador', 'Fraijanes, Carretera a El Salvador', 'Fraijanes', 245000, 'USD', 1886500, 606.65, 670, 3, 2, 4, 2, 'Casa en venta en Fontana 3

Precio de venta: US$245,000.00

Residencia con diseño moderno, espacios amplios y excelente distribución, ideal para una familia que busca comodidad, funcionalidad y un entorno exclusivo.

Esta casa en Fontana 3 ofrece una distribución práctica entre áreas sociales, privadas y de servicio, con ambientes iluminados, jardín amplio y espacios pensados para la vida familiar.

Características principales

Ubicación: Fontana 3
Precio de venta: US$245,000.00
Tipo de propiedad: Casa familiar
Estilo: Moderno, funcional y amplio
Área exterior: Pérgola y jardín amplio
Parqueos: 4 vehículos en total
Área de servicio: Cuarto de servicio con baño

Estacionamiento

2 vehículos bajo techo
Espacio techado para mayor comodidad y protección.

2 vehículos adicionales sin techo
Capacidad total para hasta 4 vehículos dentro de la propiedad.

Primer nivel — Área social y funcional

Espacio para estudio u oficina
Ambiente adaptable que puede funcionar como oficina en casa, estudio, sala privada o espacio adicional según las necesidades de la familia.

Baño de visitas
Ubicado estratégicamente para el área social.

Sala principal con excelente iluminación natural
Un ambiente amplio y agradable para recibir visitas o compartir en familia.

Comedor integrado
Área conectada con la sala y cocina, ideal para convivencia diaria.

Cocina con acceso directo a lavandería
Distribución funcional que facilita el uso diario y la operación del hogar.

Área de lavandería con acceso desde estacionamiento
Espacio práctico con acceso independiente desde el área de parqueo.

Puerta independiente para ingreso de servicio de jardinería
Un detalle funcional que permite mantener privacidad y orden en las áreas de la casa.

Cuarto de servicio con baño
Área independiente de apoyo para mayor comodidad.

Pérgola ideal para reuniones sociales
Espacio perfecto para compartir con familia y amigos en un ambiente exterior.

Amplio jardín
Área verde ideal para descanso, convivencia familiar, mascotas o actividades al aire libre.

Segundo nivel — Área privada familiar

Sala familiar acogedora
Espacio íntimo para descanso, entretenimiento o convivencia diaria.

Terraza con vista
Ambiente exterior ideal para relajarse y disfrutar de aire fresco.

2 habitaciones secundarias
Ambientes cómodos para hijos, visitas o uso familiar.

Baño compartido
Funcional para las habitaciones secundarias.

Habitación principal
Espacio privado diseñado para mayor comodidad.

Walk-in closet
Área de almacenamiento amplia y funcional.

Baño privado
Comodidad e independencia para la habitación principal.

Valor diferencial

Diseño moderno y funcional
Una residencia pensada para la vida diaria, con espacios bien integrados.

Excelente iluminación natural
Ambientes agradables, frescos y con buena entrada de luz.

Amplio jardín y pérgola
Ideal para familias que valoran áreas exteriores y espacios sociales.

Parqueo para 4 vehículos
Un beneficio importante para familias con varios vehículos o visitas.

Distribución familiar completa
Áreas sociales, privadas y de servicio perfectamente conectadas.

Información financiera

Precio de venta: US$245,000.00

Cierre comercial

Esta casa en Fontana 3 es una excelente opción para quienes buscan una residencia moderna, funcional y familiar, con espacios amplios, jardín, terraza y una distribución pensada para vivir con comodidad.

Una propiedad ideal para familias que desean un entorno exclusivo, práctico y listo para disfrutar.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Solicita información privada y agenda una visita.', '["Cerca de servicios","Zona residencial exclusiva","Acceso pavimentado","Garita 24/7","Condominio cerrado","Parqueo techado","Parqueo descubierto","Jardín amplio","Pérgola","Cocina equipada","Walk-in closet","Sala familiar","Cocina abierta","Alta plusvalía","Zona en crecimiento","Papelería en orden","Negociable","Potencial de desarrollo","Disponibilidad inmediata"]', '["https://ik.imagekit.io/Zona/CV-D-0009-CES/11.jpeg?updatedAt=1781414247065","https://ik.imagekit.io/Zona/CV-D-0009-CES/3.jpeg?updatedAt=1781414246983","https://ik.imagekit.io/Zona/CV-D-0009-CES/4.jpeg?updatedAt=1781414247064","https://ik.imagekit.io/Zona/CV-D-0009-CES/10.jpeg?updatedAt=1781414247008","https://ik.imagekit.io/Zona/CV-D-0009-CES/8.jpeg?updatedAt=1781414246950","https://ik.imagekit.io/Zona/CV-D-0009-CES/9.jpeg?updatedAt=1781414246941","https://ik.imagekit.io/Zona/CV-D-0009-CES/6.jpeg?updatedAt=1781414246941","https://ik.imagekit.io/Zona/CV-D-0009-CES/7.jpeg?updatedAt=1781414246962","https://ik.imagekit.io/Zona/CV-D-0009-CES/2.jpeg?updatedAt=1781414246982","https://ik.imagekit.io/Zona/CV-D-0009-CES/12.jpeg?updatedAt=1781414246975","https://ik.imagekit.io/Zona/CV-D-0009-CES/1.jpeg?updatedAt=1781414247059"]', NULL, NULL, 14.4654, 90.48, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781875078844', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('san-cristobal2', 'Calistemos | San Cristóbal | Casa en Venta en Planos', 'publicada', 0, 'venta', 'casa', 'san-cristobal', 'Zona 8 de Mixco', 'Mixco', 1700000, 'GTQ', 1700000, 251, NULL, 3, 2, 4, 2, 'Casa en venta en planos en Calistemos, San Cristóbal Zona 8 de Mixco

Precio de venta: Q1,700,000.00 + gastos de escrituración
Preventa | Obra nueva | Diseño moderno

Descubre una propiedad de obra nueva en fase de planos, ubicada en Calistemos, San Cristóbal, Zona 8 de Mixco, sobre el Boulevard Villa Deportiva.

Una zona en crecimiento con excelente conectividad hacia Pinares y Balcones, ideal para quienes buscan asegurar una propiedad nueva, moderna y con potencial de valorización futura.

Características principales

Ubicación: Calistemos, San Cristóbal, Zona 8 de Mixco
Referencia: Boulevard Villa Deportiva
Terreno: 6.5 metros de frente x 27 metros de fondo
Construcción: 178 m²
Niveles: 2
Parqueo: 2 vehículos
Seguridad: Garita de seguridad
Mantenimiento: Q200 mensuales
Precio de venta: Q1,700,000.00 + gastos de escrituración
Financiamiento: Opciones disponibles
Enganche: Fraccionado disponible

Planta baja — Área social y funcional

Sala
Espacio social diseñado para convivencia diaria y comodidad familiar.

Comedor
Área integrada para compartir momentos familiares y reuniones.

Cocina con isla y gabinetes
Diseño moderno, funcional y con espacio de trabajo central.

Baño de visitas
Ubicado estratégicamente para el área social.

Habitación de servicio con baño completo
Ambiente independiente para apoyo doméstico o uso funcional adicional.

Área de lavandería
Incluye conexión 220V y pila techada para mayor practicidad.

Patio trasero con pérgola y piso cerámico
Área exterior ideal para descanso, reuniones o convivencia familiar.

Amplio jardín con grama
Espacio verde que aporta frescura, amplitud y valor residencial.

Planta alta — Área privada familiar

Habitación principal
Dormitorio principal diseñado para mayor comodidad y privacidad.

Baño privado
Espacio exclusivo para la habitación principal.

Walk-in closet
Área funcional para organización y almacenamiento.

Balcón
Ambiente exterior privado para disfrutar aire fresco y luz natural.

2 habitaciones secundarias con clóset
Espacios cómodos para familia, hijos o visitas.

Una habitación secundaria con balcón
Valor adicional que aporta ventilación, luz y conexión exterior.

Baño completo compartido
Funcional para las habitaciones secundarias.

Valor diferencial

Propiedad nueva para estrenar
Una casa moderna, funcional y lista para proyectar tu nuevo estilo de vida.

Preventa con posibilidad de asegurar precio
La etapa de planos permite evaluar una oportunidad antes de entrega, con potencial de valorización futura.

Ubicación en zona de crecimiento
Calistemos, San Cristóbal, cuenta con conectividad hacia sectores como Pinares y Balcones.

Diseño moderno y bien distribuido
Espacios pensados para aprovechar cada área de forma práctica y familiar.

Seguridad dentro de garita
Mayor tranquilidad para la vida diaria.

Opciones de financiamiento disponibles
Facilidades para estructurar la compra según el perfil del comprador.

Enganche fraccionado disponible
Una alternativa atractiva para quienes desean planificar mejor su inversión.

Información financiera

Precio de venta: Q1,700,000.00 + gastos de escrituración
Opciones de financiamiento disponibles
Enganche fraccionado disponible
Mantenimiento: Q200 mensuales, incluye seguridad y áreas comunes

Tip de inversión

Esta propiedad se posiciona como una opción atractiva por tres factores clave:

Preventa
Permite asegurar una propiedad en etapa temprana.

Potencial de valorización futura
Al estar en una zona en crecimiento, puede representar una decisión patrimonial interesante.

Facilidad de pago
El enganche fraccionado permite una planificación financiera más cómoda.

Cierre comercial

Esta casa en planos en Calistemos, San Cristóbal, Zona 8 de Mixco es una excelente oportunidad para quienes buscan una propiedad nueva, moderna y con potencial de valorización.

Una opción ideal para comprar con visión, asegurar precio en etapa de preventa y aprovechar facilidades de pago en una zona con crecimiento y conectividad.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o reserva en etapa de planos.', '["Ubicación privilegiada","Cerca de servicios","Garita 24/7","Luz 110v/220v","Parqueo descubierto","Jardín amplio","Pérgola","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Sala familiar","Lavandería interna","Cocina abierta","Alta plusvalía","Zona en crecimiento","Papelería en orden","Financiamiento disponible","Negociable"]', '["https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/9.jpeg?updatedAt=1781412316110","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/2.jpeg?updatedAt=1781412316097","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/1.jpeg?updatedAt=1781412315930","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/16.jpeg?updatedAt=1781412316061","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/5.jpeg?updatedAt=1781412316054","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/6.jpeg?updatedAt=1781412316116","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/3.jpeg?updatedAt=1781412315906","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/12.jpeg?updatedAt=1781412315880","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/15.jpeg?updatedAt=1781412315830","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/11.jpeg?updatedAt=1781412315883","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/7.jpeg?updatedAt=1781412315824","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/17.jpeg?updatedAt=1781412315920","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/13.jpeg?updatedAt=1781412315763","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/10.jpeg?updatedAt=1781412315909","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/14.jpeg?updatedAt=1781412315804","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/8.jpeg?updatedAt=1781412315843","https://ik.imagekit.io/Zona/CV-+1-0029-SCRIS/18.jpeg?updatedAt=1781412315797"]', NULL, NULL, 14.6012, 90.5932, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781875661974', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('campo-grande', 'Campo Grande | Carretera a El Salvador', 'publicada', 0, 'venta', 'casa', 'carretera-el-salvador', 'Fraijanes, Carretera a El Salvador', 'Fraijanes', 125000, 'USD', 962500, 110, NULL, 3, 2, 2, 2, 'Casa en venta en Campo Grande

Precio de venta: US$125,000.00
Remodelada | Funcionalidad, comodidad y entorno residencial

Descubre una propiedad ideal para quienes buscan un hogar listo para habitar, con espacios bien distribuidos y detalles que aportan confort en un entorno seguro, organizado y residencial.

Esta casa en Campo Grande combina funcionalidad, áreas aprovechadas y una distribución práctica para vivir con comodidad o evaluar como inversión.

Características principales

Ubicación: Campo Grande
Construcción: 110 m²
Pérgola: 20 m² adicionales
Garage: 2 vehículos
Dormitorios: 3
Baños: 2.5
Jardín privado
Precio de venta: US$125,000.00
Mantenimiento: Q995 mensuales

Distribución interior

3 dormitorios
Espacios cómodos para familia, visitas o uso flexible según necesidad.

2.5 baños
Distribución funcional para el uso diario y el área social.

Sala
Ambiente principal para convivencia familiar y descanso.

Comedor
Área integrada para reuniones y momentos cotidianos.

Cocina
Espacio práctico y funcional para el día a día.

Área de lavandería
Zona independiente para mayor comodidad en el manejo del hogar.

Área exterior

Jardín privado
Un espacio agradable para descanso, mascotas, actividades familiares o decoración exterior.

Pérgola de 20 m²
Ideal para reuniones, comidas al aire libre o momentos de descanso en casa.

Garage para 2 vehículos
Parqueo cómodo dentro de la propiedad.

Valor diferencial

Propiedad remodelada
Lista para habitar, con mejoras que aportan comodidad y funcionalidad.

Espacios funcionales y bien aprovechados
Una distribución práctica para quienes buscan una casa cómoda sin áreas desperdiciadas.

Ambiente residencial con mantenimiento incluido
El mantenimiento mensual incluye agua, seguridad y mantenimiento de jardín, aportando orden y tranquilidad al entorno.

Opción para vivir o invertir
Por su precio, distribución y entorno, puede ser una alternativa interesante para vivienda o inversión patrimonial.

Información financiera

Precio de venta: US$125,000.00
Mantenimiento: Q995 mensuales
Incluye agua, seguridad y mantenimiento de jardín.

Cierre comercial

Esta casa en Campo Grande es una excelente opción para quienes buscan una propiedad remodelada, funcional y lista para habitar en un entorno residencial ordenado.

Una alternativa ideal para vivir con comodidad o invertir en una propiedad con buena distribución, jardín privado y mantenimiento incluido.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Condominio cerrado","Pozo propio","Luz 110v/220v","Parqueo techado","Jardín amplio","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Sala familiar","Lavandería interna","Cocina abierta","Zona en crecimiento","Papelería en orden","Financiamiento disponible","Negociable"]', '["https://ik.imagekit.io/Zona/CV-D-0026-CAES/11.jpeg?updatedAt=1781412226900","https://ik.imagekit.io/Zona/CV-D-0026-CAES/13.jpeg?updatedAt=1781412226683","https://ik.imagekit.io/Zona/CV-D-0026-CAES/9.jpeg?updatedAt=1781412226727","https://ik.imagekit.io/Zona/CV-D-0026-CAES/3.jpeg?updatedAt=1781412226701","https://ik.imagekit.io/Zona/CV-D-0026-CAES/1.jpeg?updatedAt=1781412226689","https://ik.imagekit.io/Zona/CV-D-0026-CAES/12.jpeg?updatedAt=1781412226662","https://ik.imagekit.io/Zona/CV-D-0026-CAES/4.jpeg?updatedAt=1781412226763","https://ik.imagekit.io/Zona/CV-D-0026-CAES/5.jpeg?updatedAt=1781412226607","https://ik.imagekit.io/Zona/CV-D-0026-CAES/7.jpeg?updatedAt=1781412226710","https://ik.imagekit.io/Zona/CV-D-0026-CAES/6.jpeg?updatedAt=1781412226614","https://ik.imagekit.io/Zona/CV-D-0026-CAES/8.jpeg?updatedAt=1781412226563","https://ik.imagekit.io/Zona/CV-D-0026-CAES/2.jpeg?updatedAt=1781412226592"]', NULL, NULL, 14.5216, 90.4459, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781876150510', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('arrazola2', 'Arrazola 2 | Carretera a El Salvador', 'publicada', 0, 'venta', 'casa', 'carretera-el-salvador', 'Arrazola, Carretera a El Salvador', 'Fraijanes', 395000, 'USD', 3041500, 110, 1346, 4, 3, 3, 2, 'Casa en venta en Arrazola 2 con terreno adicional

Precio de venta: US$395,000.00

Disfruta la comodidad de vivir en una colonia segura, con áreas verdes, amplias calles y un ambiente familiar diseñado para disfrutar cada día con tranquilidad.

Esta casa en Arrazola 2 destaca por su distribución funcional, espacios amplios y un valor diferencial importante: incluye terreno adicional a la par, ideal para ampliar, disfrutar más jardín o proyectar un área complementaria según tus necesidades.

Características principales

Ubicación: Arrazola 2
Precio de venta: US$395,000.00
Incluye: Terreno adicional a la par
Parqueos: 3 vehículos bajo techo
Habitaciones: 4 en total
Baños: 4 baños completos + baño de visitas
Incluye: 1 paja de agua
Mantenimiento: Q200.00 mensuales
IUSI: Q150.00 trimestrales

Estacionamiento

3 vehículos bajo techo
Espacio cómodo y protegido para el parqueo diario.

Primer nivel — Área social y funcional

Baño de visitas
Ubicado estratégicamente para el área social.

Sala principal
Ambiente amplio para recibir visitas o compartir en familia.

Comedor
Espacio ideal para reuniones familiares y momentos cotidianos.

Cocina
Área funcional para el uso diario del hogar.

Área de lavandería
Espacio independiente para mayor comodidad.

Bodega pequeña
Área adicional para almacenamiento.

Cuarto de servicio con baño
Espacio práctico para apoyo doméstico.

Jardín y terreno adicional
Uno de los principales diferenciales de la propiedad. El terreno adicional permite mayor amplitud, área verde o posibilidades de expansión.

Segundo nivel — Área familiar privada

Sala familiar acogedora
Espacio ideal para descanso, convivencia o entretenimiento familiar.

2 habitaciones secundarias con baño compartido
Ambientes funcionales para hijos, visitas o familiares.

1 habitación secundaria con baño privado
Una habitación adicional con mayor independencia y comodidad.

Habitación principal
Espacio privado diseñado para mayor confort.

Walk-in closet
Área amplia y funcional para organización.

Baño privado
Comodidad e independencia para la habitación principal.

Estudio
Ideal para oficina en casa, área de lectura o espacio de trabajo privado.

Valor diferencial

Terreno adicional a la par
Un beneficio poco común que brinda más amplitud y posibilidades de uso.

Colonia segura y ambiente familiar
Ideal para quienes buscan tranquilidad y orden residencial.

Áreas verdes y calles amplias
Un entorno agradable para vivir con comodidad.

Distribución familiar completa
Áreas sociales, privadas y de servicio bien integradas.

Incluye 1 paja de agua
Un valor adicional importante para la propiedad.

Información financiera

Precio de venta: US$395,000.00
Incluye: 1 paja de agua
IUSI: Q150.00 trimestrales
Mantenimiento: Q200.00 mensuales

Cierre comercial

Esta casa en Arrazola 2 es una excelente opción para familias que buscan seguridad, amplitud, áreas verdes y un entorno residencial cómodo.

Su terreno adicional a la par le da un valor especial, ya sea para disfrutar más área exterior, proyectar una ampliación o fortalecer el valor patrimonial de la propiedad.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Ubicación privilegiada","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Parqueo techado","Jardín amplio","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Estudio / Oficina","Sala familiar","Alta plusvalía","Papelería en orden","Negociable","Potencial de desarrollo","Disponibilidad inmediata"]', '["https://ik.imagekit.io/Zona/CV+1-002-CES/17.jpeg?updatedAt=1781411633575","https://ik.imagekit.io/Zona/CV+1-002-CES/9.jpeg?updatedAt=1781411633559","https://ik.imagekit.io/Zona/CV+1-002-CES/4.jpeg?updatedAt=1781411633563","https://ik.imagekit.io/Zona/CV+1-002-CES/1.jpeg?updatedAt=1781411633564","https://ik.imagekit.io/Zona/CV+1-002-CES/5.jpeg?updatedAt=1781411633519","https://ik.imagekit.io/Zona/CV+1-002-CES/12.jpeg?updatedAt=1781411633424","https://ik.imagekit.io/Zona/CV+1-002-CES/15.jpeg?updatedAt=1781411633492","https://ik.imagekit.io/Zona/CV+1-002-CES/13.jpeg?updatedAt=1781411633565","https://ik.imagekit.io/Zona/CV+1-002-CES/7.jpeg?updatedAt=1781411633424","https://ik.imagekit.io/Zona/CV+1-002-CES/2.jpeg?updatedAt=1781411633420","https://ik.imagekit.io/Zona/CV+1-002-CES/14.jpeg?updatedAt=1781411633507","https://ik.imagekit.io/Zona/CV+1-002-CES/16.jpeg?updatedAt=1781411633523","https://ik.imagekit.io/Zona/CV+1-002-CES/6.jpeg?updatedAt=1781411633528","https://ik.imagekit.io/Zona/CV+1-002-CES/3.jpeg?updatedAt=1781411633570","https://ik.imagekit.io/Zona/CV+1-002-CES/8.jpeg?updatedAt=1781411633416","https://ik.imagekit.io/Zona/CV+1-002-CES/10.jpeg?updatedAt=1781411633379","https://ik.imagekit.io/Zona/CV+1-002-CES/19.jpeg?updatedAt=1781411633477"]', NULL, NULL, 14.523, 90.4389, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781877106953', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('olmeca', 'Carretera a Olmeca | Casa en Venta', 'publicada', 0, 'venta', 'casa', 'fraijanes', 'Carretera Olmeca', 'Fraijanes', 230000, 'USD', 1771000, 400, 447, 4, 3, 4, 2, 'Casa en venta en Carretera a Olmeca

Precio de venta: US$230,000.00 — Negociable
Amplitud | Ubicación estratégica | Potencial de valorización

Ubicada a tan solo 2 km de la entrada a Olmeca, esta propiedad ofrece espacios amplios, excelente accesibilidad y una distribución ideal para vivienda familiar o inversión.

Una casa con ambientes bien iluminados, parqueo amplio y una ubicación sobre carretera que puede representar una oportunidad interesante para quienes buscan espacio, conectividad y potencial de crecimiento.

Características principales

Ubicación: Carretera a Olmeca
Referencia: A 2 km de la entrada a Olmeca
Terreno: 447 m²
Medidas: 17 metros de frente x 33 metros de fondo
Construcción: 400 m²
Niveles: 2
Parqueo: 4 vehículos
Precio de venta: US$230,000.00
IUSI anual: Aproximadamente Q375
Negociable
Propiedad registrada y libre de gravámenes

Primer nivel — Área social y funcional

Entrada principal
Acceso cómodo hacia el área social de la propiedad.

Sala
Ambiente amplio y bien iluminado para convivencia familiar o visitas.

Comedor
Espacio ideal para reuniones familiares y momentos cotidianos.

Cocina
Área funcional para el uso diario del hogar.

Baño de visitas
Ubicado estratégicamente para el área social.

Clóset para ropa o almacenamiento
Espacio práctico para organización adicional.

Jardín
Área exterior que aporta frescura, amplitud y posibilidades de uso familiar.

Bodega
Espacio adicional para almacenamiento.

Segundo nivel — Área privada familiar

Sala familiar con balcón
Espacio cómodo para descanso o convivencia privada, con salida a balcón.

Dormitorio principal
Habitación amplia con distribución funcional.

Baño privado
Comodidad e independencia para la habitación principal.

Clóset + walk-in closet
Doble espacio de almacenamiento para mayor funcionalidad.

2 dormitorios secundarios con clóset
Ambientes ideales para familia, visitas o uso flexible.

Baño compartido
Funcional para las habitaciones secundarias.

Dormitorio con espacio para estudio
Uno de los dormitorios cuenta con área adicional para oficina, lectura o zona académica.

Valor diferencial

Ubicación sobre carretera con fácil acceso
Una ventaja importante para quienes valoran conectividad y movilidad.

Ambientes amplios ideales para familias
La propiedad ofrece espacios generosos tanto en áreas sociales como privadas.

Registrada y libre de gravámenes
Mayor tranquilidad para avanzar en el proceso de compra.

Bajo costo de mantenimiento
Su IUSI anual aproximado de Q375 representa un costo operativo atractivo.

Potencial de valorización
La combinación de espacio, ubicación y accesibilidad permite analizarla como una oportunidad con proyección.

Información financiera

Precio de venta: US$230,000.00
IUSI anual: Aproximadamente Q375
Negociable

Tip de inversión

Esta propiedad se posiciona por tres factores clave:

Espacio
Terreno y construcción amplios para uso familiar o inversión.

Ubicación
Acceso sobre carretera y cercanía a la entrada de Olmeca.

Oportunidad de valorización
Una propiedad con potencial en una zona con crecimiento y buena accesibilidad.

Cierre comercial

Esta casa en Carretera a Olmeca es una excelente oportunidad para quienes buscan amplitud, accesibilidad y una propiedad con potencial de crecimiento.

Una opción ideal para vivir, invertir o analizar con visión patrimonial por su ubicación, distribución y bajo costo operativo.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Ubicación privilegiada","Sobre carretera principal","Cerca de servicios","Sistema de alarma","Portón eléctrico","Pozo propio","Parqueo techado","Parqueo descubierto","Jardín amplio","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Estudio / Oficina","Sala familiar","Lavandería interna","Alta plusvalía","Zona en crecimiento","Papelería en orden","Negociable"]', '["https://ik.imagekit.io/Zona/CV-D-0028-CAES/11.jpeg?updatedAt=1781414309758","https://ik.imagekit.io/Zona/CV-D-0028-CAES/21.jpeg?updatedAt=1781414309739","https://ik.imagekit.io/Zona/CV-D-0028-CAES/26.jpeg?updatedAt=1781414309699","https://ik.imagekit.io/Zona/CV-D-0028-CAES/3.jpeg?updatedAt=1781414309786","https://ik.imagekit.io/Zona/CV-D-0028-CAES/2.jpeg?updatedAt=1781414309722","https://ik.imagekit.io/Zona/CV-D-0028-CAES/19.jpeg?updatedAt=1781414309715","https://ik.imagekit.io/Zona/CV-D-0028-CAES/14.jpeg?updatedAt=1781414309600","https://ik.imagekit.io/Zona/CV-D-0028-CAES/16.jpeg?updatedAt=1781414309727","https://ik.imagekit.io/Zona/CV-D-0028-CAES/25.jpeg?updatedAt=1781414309627","https://ik.imagekit.io/Zona/CV-D-0028-CAES/15.jpeg?updatedAt=1781414309580","https://ik.imagekit.io/Zona/CV-D-0028-CAES/12.jpeg?updatedAt=1781414309612","https://ik.imagekit.io/Zona/CV-D-0028-CAES/17.jpeg?updatedAt=1781414309618","https://ik.imagekit.io/Zona/CV-D-0028-CAES/20.jpeg?updatedAt=1781414309630","https://ik.imagekit.io/Zona/CV-D-0028-CAES/24.jpeg?updatedAt=1781414309593","https://ik.imagekit.io/Zona/CV-D-0028-CAES/27.jpeg?updatedAt=1781414309542","https://ik.imagekit.io/Zona/CV-D-0028-CAES/5.jpeg?updatedAt=1781414309589","https://ik.imagekit.io/Zona/CV-D-0028-CAES/23.jpeg?updatedAt=1781414309714","https://ik.imagekit.io/Zona/CV-D-0028-CAES/7.jpeg?updatedAt=1781414309585","https://ik.imagekit.io/Zona/CV-D-0028-CAES/9.jpeg?updatedAt=1781414309522","https://ik.imagekit.io/Zona/CV-D-0028-CAES/13.jpeg?updatedAt=1781414309614","https://ik.imagekit.io/Zona/CV-D-0028-CAES/28.jpeg?updatedAt=1781414309575","https://ik.imagekit.io/Zona/CV-D-0028-CAES/8.jpeg?updatedAt=1781414309449","https://ik.imagekit.io/Zona/CV-D-0028-CAES/10.jpeg?updatedAt=1781414309483","https://ik.imagekit.io/Zona/CV-D-0028-CAES/1.jpeg?updatedAt=1781414309311"]', NULL, NULL, 14.5391, 90.4465, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781877538245', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('elprado', 'Zona 10 | El Prado | Casa en Venta', 'publicada', 0, 'venta', 'casa', 'zona-10', 'Guatemala Ciudad', 'Guatemala', 485000, 'USD', 3734500, 315, 447, 3, 3, 3, 2, 'Casa en venta en Zona 10

Precio de venta: US$485,000.00 + impuestos — Negociable
Espacios amplios | Funcionalidad | Excelente valor

Esta propiedad en Zona 10 destaca por sus ambientes amplios, distribución eficiente y excelente relación espacio–precio.

Una residencia ideal para quienes buscan comodidad, privacidad y funcionalidad en cada área del hogar, dentro de una de las zonas más estratégicas y consolidadas de Ciudad de Guatemala.

Características principales

Ubicación: Zona 10, Ciudad de Guatemala
Construcción: 315 m²
Parqueo: 3 vehículos
Habitaciones: 3
Baños: Cada habitación cuenta con baño privado
Precio de venta: US$485,000.00 + impuestos
Negociable
Mantenimiento: Q1,400 mensuales
IUSI: Q825 trimestrales

Distribución interior

Sala principal
Ambiente amplio y cómodo para recibir visitas o compartir en familia.

Comedor
Espacio funcional para reuniones familiares y momentos cotidianos.

Cocina con ambientes amplios
Área práctica y bien distribuida para el uso diario.

Sala familiar
Espacio privado ideal para descanso, convivencia o entretenimiento familiar.

3 habitaciones
Ambientes cómodos, diseñados para brindar privacidad y funcionalidad.

Baño privado en cada habitación
Un diferencial importante para mayor comodidad e independencia.

Clósets integrados
Espacios de almacenamiento prácticos y bien incorporados.

Bodega
Área adicional para almacenamiento.

Alacena
Espacio funcional para organización del hogar.

Cuarto de servicio
Área de apoyo para mayor comodidad operativa dentro de la propiedad.

Espacios exteriores

Pérgola
Ambiente exterior ideal para reuniones, descanso o convivencia familiar.

Área de jardín
Espacio verde que aporta frescura, amplitud y calidad de vida.

Valor diferencial

Distribución cómoda y funcional
Cada ambiente ha sido diseñado para aprovechar mejor los espacios.

Privacidad en cada habitación
El baño privado en cada dormitorio aporta independencia y comodidad.

Ambientes amplios ideales para familia
Una propiedad pensada para quienes necesitan espacio sin perder funcionalidad.

Excelente relación espacio–precio
Sus 315 m² de construcción en Zona 10 la convierten en una opción interesante para analizar con visión patrimonial.

Ubicación estratégica
Zona 10 ofrece cercanía a áreas corporativas, servicios, comercios, restaurantes y puntos clave de Ciudad de Guatemala.

Información financiera

Precio de venta: US$485,000.00 + impuestos
Negociable
Mantenimiento: Q1,400 mensuales
IUSI: Q825 trimestrales

Tip de inversión

Esta propiedad se posiciona por tres factores clave:

Espacio
315 m² de construcción con ambientes amplios y funcionales.

Comodidad
Cada habitación cuenta con baño privado, ideal para familias que valoran independencia.

Privacidad
Distribución pensada para separar áreas sociales, familiares y privadas.

Cierre comercial

Esta casa en Zona 10 es una excelente opción para quienes buscan amplitud, comodidad y valor en una sola inversión.

Una propiedad funcional, bien distribuida y ubicada en una de las zonas más estratégicas de Ciudad de Guatemala.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Condominio cerrado","Cámaras de seguridad","Portón eléctrico","Pozo propio","Luz 110v/220v","Parqueo techado","Jardín amplio","Pérgola","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Estudio / Oficina","Sala familiar"]', '["https://ik.imagekit.io/Zona/CV-+1-0030-Z10/9.jpeg?updatedAt=1781412351837","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/7.jpeg?updatedAt=1781412351798","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/8.jpeg?updatedAt=1781412351782","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/2.jpeg?updatedAt=1781412351795","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/3.jpeg?updatedAt=1781412351756","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/11.jpeg?updatedAt=1781412351725","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/5.jpeg?updatedAt=1781412351779","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/4.jpeg?updatedAt=1781412351683","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/6.jpeg?updatedAt=1781412351761","https://ik.imagekit.io/Zona/CV-+1-0030-Z10/1.jpeg?updatedAt=1781412351336"]', NULL, NULL, 14.569, 90.584, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781877936081', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('sanrafael', 'Residencia Exclusiva Terreno en San Rafael II | Carretera a El Salvador', 'publicada', 0, 'venta', 'casa', 'carretera-el-salvador', 'Carretera a El Salvador, San Rafaek', 'Guatemala', 500000, 'USD', 3850000, 530, 3000, 4, 5, 5, 2, 'Residencia exclusiva en venta en San Rafael II, Carretera a El Salvador

Precio de venta: US$500,000.00 — Negociable
Amplitud | Privacidad | Entorno residencial exclusivo

Ubicada en uno de los sectores residenciales más tranquilos y privilegiados de Carretera a El Salvador, esta residencia en San Rafael II ofrece amplitud, privacidad y un entorno natural ideal para quienes buscan calidad de vida en una zona de baja densidad.

Con 530 m² de construcción sobre un terreno de 3,000 varas², la propiedad destaca por su distribución funcional, áreas amplias y una conexión armoniosa con el entorno.

Características principales

Ubicación: San Rafael II, Carretera a El Salvador
Construcción: 530 m²
Terreno: 3,000 varas²
Habitaciones: 4 en total
Baños: Cada habitación cuenta con baño privado
Entorno: Residencial exclusivo y de baja densidad
Área exterior: Terreno amplio con áreas verdes
Precio de venta: US$500,000.00
Negociable

Áreas sociales

Amplias áreas sociales
Ambientes diseñados para compartir, recibir visitas y disfrutar momentos familiares.

Espacios ideales para convivencia
Distribución cómoda para reuniones familiares, actividades sociales o descanso diario.

Baño de visitas
Ubicado estratégicamente para el área social.

Conexión con áreas verdes
La amplitud del terreno permite disfrutar una experiencia residencial con naturaleza y privacidad.

Área privada

2 habitaciones en primer nivel con baño privado
Una distribución ideal para mayor comodidad, visitas, familiares o personas que prefieren evitar gradas.

2 habitaciones en segundo nivel con baño privado
Espacios privados diseñados para descanso, independencia y comodidad.

4 habitaciones en total, cada una con baño propio
Un diferencial importante para familias que valoran privacidad en cada dormitorio.

Terreno y entorno

Terreno de 3,000 varas²
Extensión ideal para quienes buscan amplitud, áreas verdes, privacidad y múltiples posibilidades de aprovechamiento.

Entorno residencial exclusivo
San Rafael II ofrece un ambiente tranquilo, seguro y de baja densidad.

Privacidad y naturaleza
La propiedad permite disfrutar un entorno abierto, natural y familiar, sin perder cercanía a servicios clave.

Valor diferencial

Ubicación estratégica en Carretera a El Salvador
Cercanía a centros comerciales, colegios, restaurantes y servicios esenciales.

Residencia amplia y funcional
Distribución pensada para familias que buscan comodidad y privacidad.

Todas las habitaciones con baño privado
Mayor independencia y confort para cada integrante del hogar.

Terreno amplio con potencial de aprovechamiento
Ideal para jardín, áreas sociales, ampliaciones o espacios recreativos.

Sector residencial de baja densidad
Mayor tranquilidad, privacidad y calidad de vida.

Información financiera

Precio de venta: US$500,000.00
Negociable

Cierre comercial

Esta residencia en San Rafael II, Carretera a El Salvador representa una excelente opción para quienes buscan amplitud, privacidad y un entorno residencial exclusivo rodeado de naturaleza.

Una propiedad ideal para familias que valoran espacios generosos, tranquilidad y cercanía a los principales servicios de Carretera a El Salvador.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para recibir más información o coordinar una visita privada.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Condominio cerrado","Cámaras de seguridad","Pozo propio","Luz 110v/220v","Parqueo techado","Parqueo descubierto","Jardín amplio","Pérgola","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Chimenea","Estudio / Oficina"]', '["https://ik.imagekit.io/Zona/CV-+1-0035-CES/6.1M.png?updatedAt=1781413619745","https://ik.imagekit.io/Zona/CV-+1-0035-CES/8M.png?updatedAt=1781413619650","https://ik.imagekit.io/Zona/CV-+1-0035-CES/9M.png?updatedAt=1781413619692","https://ik.imagekit.io/Zona/CV-+1-0035-CES/1M.png?updatedAt=1781413619632","https://ik.imagekit.io/Zona/CV-+1-0035-CES/5M.png?updatedAt=1781413619750","https://ik.imagekit.io/Zona/CV-+1-0035-CES/4M.png?updatedAt=1781413619719","https://ik.imagekit.io/Zona/CV-+1-0035-CES/2M.png?updatedAt=1781413619709","https://ik.imagekit.io/Zona/CV-+1-0035-CES/3M.png?updatedAt=1781413619538","https://ik.imagekit.io/Zona/CV-+1-0035-CES/9.jpeg?updatedAt=1781413619466","https://ik.imagekit.io/Zona/CV-+1-0035-CES/7.jpeg?updatedAt=1781413619444","https://ik.imagekit.io/Zona/CV-+1-0035-CES/2.jpeg?updatedAt=1781413619452","https://ik.imagekit.io/Zona/CV-+1-0035-CES/5.jpeg?updatedAt=1781413619447","https://ik.imagekit.io/Zona/CV-+1-0035-CES/1.jpeg?updatedAt=1781413619464","https://ik.imagekit.io/Zona/CV-+1-0035-CES/3.jpeg?updatedAt=1781413619454","https://ik.imagekit.io/Zona/CV-+1-0035-CES/6.jpeg?updatedAt=1781413619490","https://ik.imagekit.io/Zona/CV-+1-0035-CES/8.jpeg?updatedAt=1781413619449"]', NULL, NULL, 14.569, 90.584, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781878282470', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('zona162', 'Casa en Zona 16 | Vistas de San Isidro II', 'publicada', 0, 'venta', 'casa', 'zona-16', 'Zona 16, Ciudad de Guatemala', 'Guatemala', 350000, 'USD', 2695000, 530, 3000, 3, 3, 3, 2, 'Casa en venta en Vistas de San Isidro II, Zona 16

Precio de venta: US$350,000.00 — Negociable
Más 3% de timbres fiscales

Ubicada en uno de los sectores residenciales más exclusivos y cotizados de Zona 16, esta propiedad combina amplitud, comodidad y una distribución pensada para disfrutar cada espacio con privacidad y funcionalidad.

Con ambientes iluminados, áreas sociales integradas y una excelente conexión entre interiores y exteriores, esta residencia ofrece una experiencia ideal para quienes buscan tranquilidad, calidad de vida y una ubicación privilegiada en Ciudad de Guatemala.

Características principales

Ubicación: Vistas de San Isidro II, Zona 16
Precio de venta: US$350,000.00
Negociable
Impuestos: más 3% de timbres fiscales
Parqueo: 3 vehículos
Habitaciones: 3
Baños: cada habitación cuenta con baño privado
Área exterior: jardín privado, pérgola, balcón y terraza
Estilo: residencial, amplio y funcional

Acceso y parqueo

Parqueo para 3 vehículos
Espacio cómodo para la familia o visitas.

Gradas de ingreso con acceso residencial elegante
Entrada con presencia y diseño que aporta carácter a la propiedad.

Primer nivel — Área social y exterior

Sala principal con salida al jardín
Ambiente amplio y conectado con el exterior, ideal para convivencia y descanso.

Amplio comedor con acceso a pérgola
Espacio perfecto para reuniones familiares o sociales con conexión directa al área exterior.

Jardín privado con fuente
Área verde que aporta frescura, privacidad y un detalle distintivo al entorno residencial.

Sala adicional con salida a balcón
Espacio flexible que puede utilizarse como sala secundaria, área de lectura o ambiente familiar.

Cocina con pantry y acceso a pérgola
Distribución funcional que conecta el área de cocina con el exterior.

Baño de visitas
Ubicado estratégicamente para el área social.

Patio y área de lavandería
Espacios prácticos para el manejo diario del hogar.

Habitación de servicio en planta baja
Área independiente que aporta funcionalidad adicional a la propiedad.

Segundo nivel — Área privada familiar

Sala familiar
Ambiente íntimo para descanso, entretenimiento o convivencia diaria.

Habitación principal
Espacio privado diseñado para mayor comodidad y amplitud.

Walk-in closet
Área funcional para organización y almacenamiento.

Baño privado con tina
Comodidad y privacidad en la habitación principal.

Habitaciones secundarias con closet y baño privado
Cada dormitorio cuenta con independencia, almacenamiento y baño propio.

3 habitaciones con baño privado en total
Una distribución ideal para familias que valoran comodidad y privacidad.

Valor diferencial

Ubicación privilegiada en Zona 16
Vistas de San Isidro II es un sector residencial altamente valorado por su entorno, tranquilidad y conectividad.

Conexión entre interiores y exteriores
Jardín, pérgola, balcón y áreas sociales permiten disfrutar una experiencia residencial más completa.

Distribución amplia y funcional
La propiedad aprovecha sus espacios para separar áreas sociales, familiares y privadas.

Privacidad en cada habitación
Cada dormitorio cuenta con baño privado, un diferencial importante para la vida familiar.

Cercanía a servicios clave
Ubicación con acceso a colegios, comercios, áreas verdes y vías principales de la ciudad.

Información financiera

Precio de venta: US$350,000.00
Negociable
Impuestos: más 3% de timbres fiscales

Cierre comercial

Esta casa en Vistas de San Isidro II, Zona 16 es una excelente opción para quienes buscan amplitud, privacidad y calidad de vida en una de las zonas residenciales más cotizadas de Ciudad de Guatemala.

Una propiedad con espacios bien integrados, áreas exteriores agradables y una distribución ideal para disfrutar cada ambiente con comodidad.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para recibir más información o coordinar una visita privada.', '["Ubicación privilegiada","Cerca de servicios","Garita 24/7","Cámaras de seguridad","Parqueo techado","Parqueo descubierto","Jardín amplio","Pérgola","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Sala familiar","Lavandería interna","Alta plusvalía","Zona en crecimiento","Papelería en orden","Negociable","Potencial de desarrollo","Acepta permuta"]', '["https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/8.jpeg?updatedAt=1781413442867","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/11.jpeg?updatedAt=1781413442780","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/23.jpeg?updatedAt=1781413442884","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/6.jpeg?updatedAt=1781413442889","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/12.jpeg?updatedAt=1781413442807","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/14.jpeg?updatedAt=1781413442791","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/17.jpeg?updatedAt=1781413442837","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/19.jpeg?updatedAt=1781413442849","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/5.jpeg?updatedAt=1781413442769","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/13.jpeg?updatedAt=1781413442760","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/2.jpeg?updatedAt=1781413442794","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/21.jpeg?updatedAt=1781413442847","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/16.jpeg?updatedAt=1781413442817","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/4.jpeg?updatedAt=1781413442833","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/9.jpeg?updatedAt=1781413442813","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/7.jpeg?updatedAt=1781413442739","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/10.jpeg?updatedAt=1781413442835","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/20.jpeg?updatedAt=1781413442819","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/1.jpeg?updatedAt=1781413442755","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/18.jpeg?updatedAt=1781413442843","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/15.jpeg?updatedAt=1781413442839","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/24.jpeg?updatedAt=1781413442805","https://ik.imagekit.io/Zona/CV-+1-0032-SAN%20IS2/22.jpeg?updatedAt=1781413442815"]', NULL, NULL, 14.5959, 90.4689, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781879511251', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('vizcaya', 'Vizcaya | Carretera a El Salvador | Km.16.5', 'publicada', 0, 'venta', 'casa', 'carretera-el-salvador', 'Carretera a El Salvador km. 16.5', 'Santa Catarina Pinula', 275000, 'USD', 2117500, 325, 600, 3, 2, 4, 2, 'Casa en venta en Condominio Vizcaya, km 16.5 Carretera a El Salvador

Precio de venta: US$275,000.00 — Negociable
Entorno natural | Espacios familiares | Alta demanda residencial

Casa en venta en Condominio Vizcaya, km 16.5 Carretera a El Salvador, ubicada en un entorno residencial ideal para quienes buscan comodidad, amplitud y una distribución funcional para la vida familiar.

La propiedad cuenta con espacios bien definidos, áreas sociales acogedoras, jardín amplio con desnivel, pérgola y ambientes complementarios como estudio, sala familiar y cuarto de servicio. Una excelente opción para vivir en una zona de alta demanda, con fácil acceso y ambiente seguro.

Ubicación: Condominio Vizcaya, km 16.5 Carretera a El Salvador
Precio de venta: US$275,000.00
Negociable

Distribución funcional para vida familiar
Ambientes sociales, privados y de servicio bien definidos.

Información financiera

Precio de venta: US$275000.00
Negociable

Cierre comercial

Esta casa en Condominio Vizcaya, km 16.5 Carretera a El Salvador es una excelente opción para quienes buscan vivir en un entorno residencial seguro, natural y con espacios funcionales para la familia.

Una propiedad con buena distribución, jardín amplio, áreas complementarias y ubicación estratégica en una de las zonas más demandadas de Carretera a El Salvador.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Condominio cerrado","Cámaras de seguridad","Muros perimetrales","Portón eléctrico","Pozo propio","Luz 110v/220v","Jardín amplio","Pérgola","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Estudio / Oficina","Sala familiar"]', '["https://ik.imagekit.io/Zona/CV-D-0017-CES/12.jpeg?updatedAt=1781332577179","https://ik.imagekit.io/Zona/CV-D-0017-CES/10.jpeg?updatedAt=1781332577107","https://ik.imagekit.io/Zona/CV-D-0017-CES/14.jpeg?updatedAt=1781332577093","https://ik.imagekit.io/Zona/CV-D-0017-CES/15.jpeg?updatedAt=1781332577299","https://ik.imagekit.io/Zona/CV-D-0017-CES/18.jpeg?updatedAt=1781332577066","https://ik.imagekit.io/Zona/CV-D-0017-CES/6.jpeg?updatedAt=1781332577054","https://ik.imagekit.io/Zona/CV-D-0017-CES/9.jpeg?updatedAt=1781332577135","https://ik.imagekit.io/Zona/CV-D-0017-CES/5.jpeg?updatedAt=1781332577046","https://ik.imagekit.io/Zona/CV-D-0017-CES/4.jpeg?updatedAt=1781332577150","https://ik.imagekit.io/Zona/CV-D-0017-CES/7.jpeg?updatedAt=1781332577041","https://ik.imagekit.io/Zona/CV-D-0017-CES/13.jpeg?updatedAt=1781332577080","https://ik.imagekit.io/Zona/CV-D-0017-CES/2.jpeg?updatedAt=1781332577070","https://ik.imagekit.io/Zona/CV-D-0017-CES/8.jpeg?updatedAt=1781332577147","https://ik.imagekit.io/Zona/CV-D-0017-CES/1.jpeg?updatedAt=1781332576995","https://ik.imagekit.io/Zona/CV-D-0017-CES/3.jpeg?updatedAt=1781332577092","https://ik.imagekit.io/Zona/CV-D-0017-CES/17.jpeg?updatedAt=1781332577253"]', NULL, NULL, 14.5392, 90.453, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781879814665', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('zona15vh3', 'Zona 15 | Vista Hermosa 3', 'publicada', 0, 'venta', 'casa', 'zona-15', 'Vista Hermosa 3, zona 15', 'Guatemala', 400000, 'USD', 3080000, 270, 600, 2, 3, 4, 2, 'Casa en venta en Zona 15 — Vista Hermosa 3

Precio de venta: US$400,000.00 — Negociable
Ubicación exclusiva | Espacios amplios | Estilo de vida familiar

Ubicada en una de las zonas más exclusivas y cotizadas de Ciudad de Guatemala, esta propiedad en Vista Hermosa 3, Zona 15, ofrece una combinación ideal entre ubicación, comodidad y calidad de vida.

A pocos minutos de Ciudad Cayalá, Embajada Americana, universidades de prestigio y centros comerciales, esta residencia es una excelente opción para familias que buscan tranquilidad, seguridad y acceso rápido a servicios clave.

Características principales

Ubicación: Vista Hermosa 3, Zona 15
Construcción: 270 m²
Niveles: 2
Ambientes: Amplios y con excelente iluminación natural
Parqueos: 4 en total, 2 techados
Precio de venta: US$400,000.00
Negociable

Cercanía estratégica

Ciudad Cayalá
A pocos minutos de uno de los puntos comerciales, gastronómicos y residenciales más reconocidos de la ciudad.

Embajada Americana
Ubicación conveniente para quienes valoran cercanía a instituciones importantes.

Universidades de prestigio
Ideal para familias con hijos universitarios o profesionales que buscan conectividad.

Centros comerciales
Acceso rápido a comercios, restaurantes, servicios y entretenimiento.

Primer nivel — Área social y exterior

Sala principal con chimenea
Ambiente acogedor, amplio y con carácter para reuniones familiares o sociales.

Jardín interior con doble altura
Un detalle arquitectónico que aporta luz, amplitud y conexión natural dentro de la residencia.

Comedor integrado
Espacio funcional para convivencia diaria y reuniones especiales.

Cocina equipada
Diseñada para uso diario con practicidad y comodidad.

Bar ideal para reuniones
Un ambiente social perfecto para compartir con familia o invitados.

Pérgola exterior
Área ideal para descanso, reuniones o momentos al aire libre.

Jardín posterior
Espacio verde que aporta frescura, privacidad y calidad de vida.

Dormitorio de servicio con baño
Área independiente de apoyo para el hogar.

Área de lavandería
Espacio funcional para el manejo diario de la casa.

Patio de tender
Área ventilada y práctica para labores domésticas.

4 parqueos, 2 techados
Capacidad cómoda para la familia y visitas.

Segundo nivel — Área privada familiar

Sala familiar
Espacio íntimo para descanso, entretenimiento o convivencia diaria.

Dormitorio principal
Habitación amplia con baño privado y walk-in closet.

Walk-in closet
Área funcional para organización y almacenamiento.

2 dormitorios secundarios
Ambientes cómodos para familia, hijos o visitas.

Baño compartido
Funcional para las habitaciones secundarias.

Bodega
Espacio adicional para almacenamiento.

Amplia terraza
Área exterior ideal para disfrutar aire fresco, reuniones o momentos de descanso.

Valor diferencial

Ubicación privilegiada en Zona 15
Vista Hermosa 3 es uno de los sectores más cotizados por su tranquilidad, conectividad y cercanía a servicios clave.

Excelente iluminación natural
Ambientes agradables, frescos y con sensación de amplitud.

Jardín interior de doble altura
Un detalle distintivo que eleva la experiencia residencial.

Áreas sociales para compartir
Bar, pérgola, terraza y jardín posterior permiten disfrutar la casa tanto en familia como con invitados.

Distribución ideal para familias
Espacios sociales, privados y de servicio bien integrados.

Información financiera

Precio de venta: US$400,000.00
Negociable

Cierre comercial

Esta casa en Vista Hermosa 3, Zona 15 es una excelente opción para quienes buscan vivir en una ubicación exclusiva, con espacios amplios, áreas sociales completas y cercanía a los principales puntos de Ciudad de Guatemala.

Una propiedad ideal para familias que valoran comodidad, seguridad, conectividad y calidad de vida.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Parqueo techado","Parqueo descubierto","Jardín amplio","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Estudio / Oficina","Sala familiar","Alta plusvalía","Zona en crecimiento","Papelería en orden","Negociable","Potencial de desarrollo"]', '["https://ik.imagekit.io/Zona/CV-+1-0019-Z15/9.jpeg?updatedAt=1781411774335","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/8.jpeg?updatedAt=1781411774319","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/20.jpeg?updatedAt=1781411774235","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/16.jpeg?updatedAt=1781411774305","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/25.jpeg?updatedAt=1781411774311","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/21.jpeg?updatedAt=1781411774266","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/19.jpeg?updatedAt=1781411774266","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/17.jpeg?updatedAt=1781411774257","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/7.jpeg?updatedAt=1781411774254","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/22.jpeg?updatedAt=1781411774248","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/1.jpeg?updatedAt=1781411774249","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/24.jpeg?updatedAt=1781411774318","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/5.jpeg?updatedAt=1781411774209","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/2.jpeg?updatedAt=1781411774327","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/6.jpeg?updatedAt=1781411774225","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/10.jpeg?updatedAt=1781411774200","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/14.jpeg?updatedAt=1781411774154","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/12.jpeg?updatedAt=1781411774171","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/4.jpeg?updatedAt=1781411774152","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/26.jpeg?updatedAt=1781411774131","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/18.jpeg?updatedAt=1781411774243","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/3.jpeg?updatedAt=1781411774164","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/11.jpeg?updatedAt=1781411774059","https://ik.imagekit.io/Zona/CV-+1-0019-Z15/15.jpeg?updatedAt=1781411774088"]', NULL, NULL, 14.6044, 90.4892, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781880293584', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('sancristobal-b1', 'San Cristóbal | Sector B1 | Casa', 'publicada', 0, 'venta', 'casa', 'san-cristobal', 'Zona 8 de Mixco', 'Mixco', 2400000, 'GTQ', 2400000, 352, 378, 3, 2, 4, 2, 'Casa en venta en Sector B1 San Cristóbal, Zona 8 de Mixco

Precio de venta: Q2,400,000.00 + timbres y gastos de ley — Negociable
Residencia de 1 nivel | Dentro de garita | Ubicación estratégica

Residencia de un nivel ubicada dentro de garita en el Sector B1 de San Cristóbal, Zona 8 de Mixco, en un entorno residencial consolidado, seguro y con fácil acceso.

Su cercanía a puntos clave como el sector de Burger King San Cristóbal la convierte en una opción ideal para quienes buscan comodidad, seguridad y movilidad en una de las áreas más reconocidas de San Cristóbal.

Características principales

Ubicación: Sector B1 San Cristóbal, Zona 8 de Mixco
Tipo de propiedad: Casa de 1 nivel
Terreno: 378 m²
Medidas del terreno: 13.5 x 28 metros
Construcción: 352 m²
Parqueo: 2 vehículos bajo techo + 2 adicionales al frente
Seguridad: Dentro de garita
Precio de venta: Q2,400,000.00
Gastos: + timbres y gastos de ley
Negociable

Parqueo y acceso

2 vehículos bajo techo
Espacio cómodo y protegido para el uso diario.

2 vehículos adicionales al frente
Capacidad extra para familia o visitas.

Portón eléctrico
Mayor comodidad y control en el ingreso a la propiedad.

Ubicación dentro de garita
Un entorno residencial con seguridad y mayor tranquilidad.

Distribución interior

Sala principal
Ambiente amplio y funcional para convivencia familiar o visitas.

Comedor
Espacio cómodo para reuniones familiares y momentos cotidianos.

Cocina
Área práctica y bien ubicada para el uso diario del hogar.

Área de lavandería
Espacio independiente para mayor funcionalidad.

Sala familiar
Ambiente privado ideal para descanso, entretenimiento o convivencia diaria.

Habitación máster
Dormitorio principal con baño privado y clóset.

2 habitaciones secundarias con clóset
Espacios cómodos para familia, hijos o visitas.

Baño completo para habitaciones secundarias
Funcional para las habitaciones secundarias y la vida familiar.

Cuarto de servicio con baño completo
Área independiente de apoyo para mayor comodidad operativa.

Espacios exteriores

Jardín
Espacio exterior ideal para descanso, convivencia o actividades familiares.

Patio
Área funcional que aporta ventilación, luz y practicidad al hogar.

Extras y equipamiento

Cisterna
Un valor importante para abastecimiento y respaldo de agua.

Portón eléctrico
Comodidad y seguridad adicional para el ingreso.

Techo de madera tipo Ligmun
Detalle distintivo que aporta calidez, carácter y estilo a la residencia.

Seguridad dentro de garita
Mayor tranquilidad para la vida diaria.

Valor diferencial

Casa de un nivel
Ideal para quienes buscan comodidad, accesibilidad y distribución práctica sin gradas.

Ubicación estratégica en San Cristóbal
Cercana a puntos clave como el sector de Burger King, comercios, servicios y vías principales.

Entorno seguro dentro de garita
Una ventaja importante para familias que priorizan tranquilidad.

Ambientes amplios y funcionales
352 m² de construcción pensados para una vida familiar cómoda.

Detalles constructivos con carácter
El techo de madera tipo Ligmun aporta una sensación cálida y residencial.

Información financiera

Precio de venta: Q2,400,000.00
Adicional: timbres y gastos de ley
Negociable

Cierre comercial

Esta casa de un nivel en Sector B1 San Cristóbal, Zona 8 de Mixco es una excelente opción para quienes buscan seguridad, amplitud y comodidad en una ubicación consolidada.

Una propiedad ideal para familias que valoran vivir dentro de garita, con espacios funcionales, jardín, parqueo amplio y fácil acceso a servicios clave de San Cristóbal.

Zona-INNmueble | Guatemala
Asesoría inmobiliaria con análisis, valores y claridad.

Contáctanos para más información o agenda tu visita.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Garita 24/7","Cámaras de seguridad","Portón eléctrico","Luz 110v/220v","Parqueo techado","Parqueo descubierto","Jardín amplio","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Estudio / Oficina","Sala familiar","Lavandería interna","Alta plusvalía","Zona en crecimiento"]', '["https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/19.jpeg?updatedAt=1781412133981","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/2.jpeg?updatedAt=1781412133885","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/4.jpeg?updatedAt=1781412132175","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/17.jpeg?updatedAt=1781412132153","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/20.jpeg?updatedAt=1781412132142","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/3.jpeg?updatedAt=1781412132088","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/12.jpeg?updatedAt=1781412132130","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/13.jpeg?updatedAt=1781412132012","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/11.jpeg?updatedAt=1781412131983","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/5.jpeg?updatedAt=1781412132029","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/10.jpeg?updatedAt=1781412131988","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/14.jpeg?updatedAt=1781412131945","https://ik.imagekit.io/Zona/CV-+1-0023-SCRIS/15.jpeg?updatedAt=1781412131925"]', NULL, NULL, 14.6012, 90.5932, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1781880761674', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('fontana2', 'Casa en La Fontana | CAES', 'publicada', 0, 'venta', 'casa', 'carretera-el-salvador', 'Km 25.5', 'Fraijanes', 215000, 'USD', 1655500, 170, 529, 3, 2, 4, 2, 'Casa en venta con amplio jardín en La Fontana, Km 25.5 CAES

Ubicación: La Fontana, Km 25.5 Carretera a El Salvador
Precio: US$215,000 + impuestos
Construcción: 170 m²
Terreno: 529 varas²

Linda casa de esquina en venta, ubicada en La Fontana, Km 25.5 Carretera a El Salvador, ideal para quienes buscan un hogar funcional, con buen terreno, jardín plano y espacios cómodos para la vida familiar.

Su distribución permite aprovechar muy bien las áreas sociales y privadas, además de contar con accesos independientes hacia el jardín, lo que brinda mayor practicidad para reuniones, uso familiar o actividades al aire libre.

Características principales

Casa de esquina
Jardín plano
Garage para 4 vehículos
170 m² de construcción
529 varas² de terreno
Dos accesos independientes al jardín
Ubicada en Km 25.5 Carretera a El Salvador

Área social

La casa cuenta con una distribución cómoda y funcional:

Sala principal
Comedor
Cocina
Pérgola
Jardín plano con excelente aprovechamiento

La pérgola y el jardín ofrecen un ambiente ideal para compartir en familia, recibir visitas o disfrutar de un espacio exterior privado.

Área privada

La propiedad dispone de:

Habitación principal con walk-in closet y baño privado
2 habitaciones secundarias con clóset
Baño compartido para habitaciones secundarias
Sala familiar

La sala familiar aporta un espacio adicional para descanso, televisión o convivencia diaria.

Área de servicio y parqueo

Lavandería techada
Garage para 4 vehículos
Dos accesos independientes hacia el jardín

Valor diferencial

Esta propiedad destaca por su amplio terreno, su jardín plano, la comodidad de ser casa de esquina y su ubicación sobre Carretera a El Salvador, una de las zonas con mayor demanda residencial por su crecimiento, accesos y entorno familiar.

Una excelente opción para quienes buscan vivir en un sector tranquilo, con espacios exteriores amplios y buena distribución interior.

Contáctanos para más información o para coordinar una visita.
Zona-INNmueble | Asesoría inmobiliaria con análisis, valores y claridad.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Acceso pavimentado","Vista al valle","Garita 24/7","Condominio cerrado","Muros perimetrales","Pozo propio","Luz 110v/220v","Gas propano","Jardín amplio","Área de BBQ","Pérgola","Juegos infantiles","Cocina equipada","Walk-in closet","Estudio / Oficina","Sala familiar"]', '["https://ik.imagekit.io/Zona/Fontana%202/1.jpeg","https://ik.imagekit.io/Zona/Fontana%202/10.jpeg","https://ik.imagekit.io/Zona/Fontana%202/11.jpeg","https://ik.imagekit.io/Zona/Fontana%202/12.jpeg","https://ik.imagekit.io/Zona/Fontana%202/2.jpeg","https://ik.imagekit.io/Zona/Fontana%202/3.jpeg","https://ik.imagekit.io/Zona/Fontana%202/5.jpeg","https://ik.imagekit.io/Zona/Fontana%202/6.jpeg","https://ik.imagekit.io/Zona/Fontana%202/7.jpeg","https://ik.imagekit.io/Zona/Fontana%202/8.jpeg","https://ik.imagekit.io/Zona/Fontana%202/9.jpeg"]', NULL, NULL, 14.492, 90.456, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1783008330719', datetime('now'));
INSERT OR IGNORE INTO properties (slug, title, status, verified, operation, type, zone_slug, location_label, municipality, price_amount, currency, price_gtq, area_built_m2, area_land_v2, bedrooms, bathrooms, parking, levels, description, features, images, tour_url, video_url, lat, lng, agency_id, agent_id, source, source_ref, published_at) VALUES ('florencia', 'Casa Nueva | Florencia | Milpas Altas', 'publicada', 0, 'venta', 'casa', 'milpas-altas', 'Florencia, Milpas Altas', 'Milpas Altas', 2600000, 'GTQ', 2600000, 365, 317, 4, 3, 3, 3, 'Casa nueva en venta en Florencia

Ubicación: Florencia, cerca de Carretera Interamericana
Entorno: Colonia residencial con seguridad 24/7
Amenidades: Áreas recreativas, senderos para caminatas, naturaleza y vistas a los volcanes

Descubre esta casa nueva en venta dentro de una colonia residencial en Florencia, una ubicación privilegiada por su cercanía a la Carretera Interamericana, rodeada de naturaleza, tranquilidad y vistas hacia los volcanes.

Una propiedad ideal para quienes buscan un hogar moderno, cómodo y funcional, en un entorno seguro para vivir en familia.

Características principales

Casa nueva
Seguridad 24/7
Áreas recreativas
Espacios ideales para caminatas dentro de la colonia
Vistas a los volcanes
Cerca de Carretera Interamericana
Garaje techado para 3 vehículos
Jardín frontal
Terraza con vistas panorámicas

Planta baja

Garaje techado para 3 vehículos
Espacioso, seguro y funcional para proteger tus vehículos.

Sala con doble altura
Un ambiente amplio, iluminado y elegante que brinda una sensación de amplitud desde el ingreso.

Comedor
Ideal para compartir momentos especiales en familia.

Cocina con gabinetes fundidos y madera
Diseñada para ofrecer practicidad, durabilidad y buen aprovechamiento del espacio.

Estudio
Perfecto para trabajar desde casa, área de lectura o espacio multifuncional.

Baño de visitas

Bodega
Espacio adicional para almacenamiento.

Jardín frontal

Segundo nivel

Sala familiar
Un espacio cómodo para relajarse, ver televisión o compartir en familia.

Servicio sanitario completo

3 amplias habitaciones
Diseñadas para brindar comodidad y funcionalidad a cada integrante de la familia.

Habitación principal con clóset y baño privado

Tercer nivel

Terraza
Perfecta para disfrutar vistas panorámicas, momentos al aire libre o reuniones familiares.

Lavandería
Área práctica y funcional para el orden del hogar.

Valor diferencial

Esta propiedad combina diseño moderno, comodidad y entorno natural en una de las áreas residenciales más agradables de Florencia.

Su ubicación cercana a la Carretera Interamericana, la seguridad 24/7, las áreas recreativas y sus espacios bien distribuidos la convierten en una excelente opción para quienes buscan vivir con tranquilidad, amplitud y conexión con la naturaleza.

Contáctanos para más información o para coordinar una visita.
Zona-INNmueble | Asesoría inmobiliaria con análisis, valores y claridad.', '["Ubicación privilegiada","Entorno natural y vistas","Cerca de servicios","Zona residencial exclusiva","Acceso pavimentado","Vista al valle","Vista a montañas","Garita 24/7","Condominio cerrado","Muros perimetrales","Pozo propio","Luz 110v/220v","Gas propano","Jardín amplio","Terraza exterior","Cocina equipada","Walk-in closet","Cuarto de servicio con baño","Bodega","Estudio / Oficina"]', '["https://ik.imagekit.io/Zona/San%20Lucas/2.jpg","https://ik.imagekit.io/Zona/San%20Lucas/3.jpg","https://ik.imagekit.io/Zona/San%20Lucas/4.jpg","https://ik.imagekit.io/Zona/San%20Lucas/5.jpg","https://ik.imagekit.io/Zona/San%20Lucas/6.jpg","https://ik.imagekit.io/Zona/San%20Lucas/7.jpg","https://ik.imagekit.io/Zona/San%20Lucas/8.jpg","https://ik.imagekit.io/Zona/San%20Lucas/9.jpg"]', NULL, NULL, 14.55834, 90.68295, (SELECT id FROM agencies WHERE slug = 'zona-innmueble'), (SELECT id FROM agents WHERE name = 'Zoraida Quintana' LIMIT 1), 'import-wix', '1783011914534', datetime('now'));
