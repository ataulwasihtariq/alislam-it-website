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
    wp_enqueue_style('amj-fonts', 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;600&display=swap', [], null);
    wp_enqueue_style('amj-icons', 'https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css', [], null);
    wp_enqueue_style('amj', $u . 'css/amj.css', ['amj-fonts'], '2.0.0');
    wp_enqueue_script('amj', $u . 'js/amj.js', [], '2.0.0', true);
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
    // Eventi: titolo, descrizione e quattro campi (data, ora, luogo, città).
    register_post_type('evento', [
        'label' => 'Eventi', 'public' => true, 'has_archive' => false,
        'rewrite' => ['slug' => 'evento'], 'menu_icon' => 'dashicons-calendar-alt',
        'supports' => ['title', 'editor', 'excerpt', 'custom-fields'], 'show_in_rest' => true,
    ]);
    foreach (['amj_data' => 'Data (AAAA-MM-GG)', 'amj_ora' => 'Ora (HH:MM)', 'amj_luogo' => 'Luogo', 'amj_citta' => 'Città', 'amj_da_confermare' => 'Data da confermare (1 o vuoto)'] as $k => $l) {
        register_post_meta('evento', $k, ['single' => true, 'type' => 'string', 'show_in_rest' => true, 'description' => $l]);
    }
});

// Elenco eventi in JSON, nello stesso formato di assets/data/eventi.json: /?amj_eventi=1
add_action('template_redirect', function () {
    if (!isset($_GET['amj_eventi'])) return;
    $out = [];
    $q = new WP_Query(['post_type' => 'evento', 'posts_per_page' => 100, 'post_status' => 'publish', 'meta_key' => 'amj_data', 'orderby' => 'meta_value', 'order' => 'ASC']);
    foreach ($q->posts as $p) {
        $d = get_post_meta($p->ID, 'amj_data', true);
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) continue;
        $t = get_post_meta($p->ID, 'amj_ora', true);
        $out[] = [
            'id' => 'evento-' . $p->ID, 'title' => get_the_title($p),
            'start' => $d . (preg_match('/^\d{2}:\d{2}$/', $t) ? 'T' . $t : ''),
            'kind' => 'Evento', 'city' => get_post_meta($p->ID, 'amj_citta', true), 'place' => get_post_meta($p->ID, 'amj_luogo', true),
            'tentative' => (bool) get_post_meta($p->ID, 'amj_da_confermare', true),
            'desc' => wp_strip_all_tags(get_the_excerpt($p)), 'url' => get_permalink($p),
        ];
    }
    nocache_headers();
    wp_send_json(['events' => $out]);
});

// [amj_eventi] mostra l'elenco degli eventi futuri (stesso aspetto della pagina Eventi del sito statico)
add_shortcode('amj_eventi', function () {
    return '<div data-events data-src="' . esc_url(home_url('/?amj_eventi=1')) . '"></div>';
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
