<?php get_header(); ?>
<section class="amj-s"><div class="amj-w amj-prose">
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
<h1><?php the_title(); ?></h1><?php the_content(); ?>
<?php endwhile; else : ?><h1>Pagina non trovata</h1><?php endif; ?>
</div></section>
<?php get_footer();
