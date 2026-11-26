<!doctype html>
<html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#16201c"><script>document.documentElement.className='js'</script><?php wp_head(); ?></head>
<body <?php body_class('amj'); ?>>
<?php
$home = esc_url(home_url('/'));
$voci = [
    ['Conoscere l’Islam', 'islam/', []],
    ['Chi siamo', 'chi-siamo/', [['Chi siamo', 'chi-siamo/'], ['Il Messia Promesso', 'chi-siamo/messia-promesso/'], ['La Khilafat e i cinque Califfi', 'chi-siamo/khulafa/'], ['La Comunità in Italia', 'chi-siamo/storia-in-italia/'], ['Dicono di noi', 'dicono-di-noi/']]],
    ['Domande', 'domande/', [['Tutte le domande', 'domande/'], ['Le accuse più comuni', 'domande/accuse/'], ['Gesù: vivo o morto?', 'domande/gesu/']]],
    ['Orari di preghiera', 'orari-preghiera/', [['Orari delle Jama’at in Italia', 'orari-preghiera/'], ['Sede nazionale Baitut Tauhid', 'baitut-tauhid/'], ['Ramadan 2027', 'ramadan/']]],
    ['Sermoni', 'sermoni/', []], ['Libri', 'libri/', []], ['Eventi', 'eventi/', []],
];
$req = trim(wp_parse_url(add_query_arg([]), PHP_URL_PATH), '/');
?>
<a class="amj-skip" href="#contenuto">Vai al contenuto</a>
<div class="amj-top"><div class="amj-w"><span>Comunità Islamica Ahmadiyya in Italia</span>
<span><a href="tel:800598005">Numero verde 800 598 005</a><a href="https://wa.me/390511990451">WhatsApp +39 051 199 00 451</a><a href="mailto:contatti@alislam.it">contatti@alislam.it</a></span></div></div>
<header class="amj-header"><div class="amj-bar">
<a href="<?php echo $home; ?>" class="amj-brand"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/img/logo-jamaat-lockup.svg" width="181" height="40" alt="<?php echo esc_attr(get_bloginfo('name')); ?>" class="amj-logo-full"></a>
<button class="amj-burger" aria-expanded="false" aria-controls="amj-nav" aria-label="Menu"><span></span><span></span><span></span></button>
<nav class="amj-nav" id="amj-nav" aria-label="Menu principale">
<?php
$gruppi = [
    ['Conoscere', 'islam/', [['Che cos’è l’Islam', 'islam/'], ['Chi siamo', 'chi-siamo/'], ['Il Messia Promesso', 'chi-siamo/messia-promesso.html'], ['La Khilafat', 'chi-siamo/khulafa.html'], ['Domande e risposte', 'domande/'], ['Dicono di noi', 'dicono-di-noi/'], ['Siti collegati', 'collegamenti/']]],
    ['Orari e Ramadan', 'orari-preghiera/', [['Orari di preghiera', 'orari-preghiera/'], ['Orari di Baitut Tauhid', 'baitut-tauhid/'], ['Ramadan 2027', 'ramadan/']]],
    ['Eventi', 'eventi/', []],
    ['Sermoni e libri', 'sermoni/', [['Sermoni del Venerdì', 'sermoni/'], ['Libri', 'libri/']]],
];
foreach ($gruppi as $g) : $cur = ($req === rtrim($g[1], '/')) ? ' aria-current="page"' : ''; ?>
<?php if ($g[2]) : ?>
<span class="amj-dd"><a href="<?php echo esc_url(home_url('/' . $g[1])); ?>"<?php echo $cur; ?>><?php echo esc_html($g[0]); ?></a>
<span class="amj-menu"><?php foreach ($g[2] as $k) : ?><a href="<?php echo esc_url(home_url('/' . $k[1])); ?>"><?php echo esc_html($k[0]); ?></a><?php endforeach; ?></span></span>
<?php else : ?>
<a href="<?php echo esc_url(home_url('/' . $g[1])); ?>"<?php echo $cur; ?>><?php echo esc_html($g[0]); ?></a>
<?php endif; endforeach; ?>
<span class="amj-dd"><a href="<?php echo esc_url(home_url('/dipartimenti/')); ?>">Dipartimenti</a>
<span class="amj-menu"><?php foreach (get_posts(['post_type' => 'dipartimento', 'numberposts' => 20, 'orderby' => 'menu_order title', 'order' => 'ASC']) as $d) : ?><a href="<?php echo esc_url(get_permalink($d)); ?>"><i></i><?php echo esc_html(get_the_title($d)); ?></a><?php endforeach; ?><hr><a href="<?php echo esc_url(home_url('/dipartimenti/')); ?>"><i></i>Tutti i dipartimenti</a><a href="<?php echo esc_url(home_url('/area-riservata/')); ?>"><i></i>Area riservata</a></span></span>
<a href="<?php echo esc_url(home_url('/jalsa-salana/')); ?>" class="amj-jalsa"><img src="<?php echo esc_url(get_template_directory_uri()); ?>/assets/img/dept/jalsa-salana-icon.webp" width="22" height="22" alt="">Jalsa Salana</a>
<a href="<?php echo esc_url(home_url('/contatti/')); ?>" class="amj-cta">Parliamone</a>
</nav></div></header>
<main id="contenuto">
