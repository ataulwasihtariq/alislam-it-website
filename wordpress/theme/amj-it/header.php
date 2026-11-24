<!doctype html>
<html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<header class="amj-hd"><div class="amj-w"><a class="amj-brand" href="<?php echo esc_url(home_url('/')); ?>"><img class="amj-logo" src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/img/logo-jamaat-emblema.png" width="50" height="49" alt="Logo della Comunità Musulmana Ahmadiyya"><span><b><?php bloginfo('name'); ?></b></span></a>
<button class="amj-burger" aria-label="Menu">☰</button>
<nav class="amj-nav"><?php wp_nav_menu(['theme_location' => 'principale', 'container' => false, 'fallback_cb' => false]); ?></nav></div></header>
<main>
