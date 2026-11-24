<!doctype html>
<html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<header class="amj-hd"><div class="amj-w"><a class="amj-brand" href="<?php echo esc_url(home_url('/')); ?>"><img class="amj-logo-full" src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/img/logo-jamaat-lockup.png" width="262" height="58" alt="<?php echo esc_attr(get_bloginfo('name')); ?>"></a>
<button class="amj-burger" aria-label="Menu">☰</button>
<nav class="amj-nav"><?php wp_nav_menu(['theme_location' => 'principale', 'container' => false, 'fallback_cb' => false]); ?></nav></div></header>
<main>
