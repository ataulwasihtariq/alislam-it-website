<?php
// Tema AMJ Italia: stili, dipartimenti e predisposizione codice socio (disattivata di default).
if (!defined('ABSPATH')) exit;

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    register_nav_menus(['principale' => 'Menu principale']);
});

add_action('wp_enqueue_scripts', function () {
    $u = get_template_directory_uri() . '/assets/';
    wp_enqueue_style('amj', $u . 'css/amj.css', [], '1.0.0');
    wp_enqueue_script('amj', $u . 'js/amj.js', [], '1.0.0', true);
});

add_action('init', function () {
    register_post_type('dipartimento', [
        'label' => 'Dipartimenti', 'public' => true, 'has_archive' => true,
        'rewrite' => ['slug' => 'dipartimenti'], 'menu_icon' => 'dashicons-groups',
        'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
    ]);
    register_post_type('sermone', [
        'label' => 'Sermoni', 'public' => true, 'has_archive' => true,
        'rewrite' => ['slug' => 'sermoni'], 'menu_icon' => 'dashicons-microphone',
        'supports' => ['title', 'editor', 'excerpt'],
    ]);
});

// --- Codice socio: predisposizione. Per attivarla: Impostazioni > opzione amj_codici_attivi = 1 ---
function amj_codici_attivi() { return (bool) get_option('amj_codici_attivi', 0); }

add_action('init', function () {
    foreach (['amj_membro' => 'Membro', 'amj_amila' => 'Amila', 'amj_sadr' => 'Sadr'] as $k => $n) {
        if (!get_role($k)) add_role($k, $n, ['read' => true]);
    }
});

// [amj_riservato ruolo="amj_amila"] contenuto [/amj_riservato]
add_shortcode('amj_riservato', function ($atts, $content = '') {
    if (!amj_codici_attivi()) return '<p class="amj-note">Area riservata in preparazione.</p>';
    $a = shortcode_atts(['ruolo' => 'amj_membro'], $atts);
    $u = wp_get_current_user();
    if ($u->exists() && (in_array($a['ruolo'], $u->roles, true) || in_array('administrator', $u->roles, true))) {
        return do_shortcode($content);
    }
    return '<p class="amj-note">Contenuto riservato ai membri.</p>';
});

add_shortcode('amj_accesso', function () {
    if (!amj_codici_attivi()) return '<p class="amj-note">L’area riservata è in preparazione.</p>';
    return wp_login_form(['echo' => false, 'label_username' => 'Codice socio']);
});

add_action('wp_head', function () {
    if (is_page(['area-riservata', 'privacy'])) echo '<meta name="robots" content="noindex,nofollow">' . "\n";
});
