<?php
/** Template Name: Page Wide */


//session_start() dans functions.php 


get_header('', array( 'menu_principal' => 'Voce Tolosa' ));
?>
<div id="main-et-footer">
					<button id="menu-toggle" class="menu-toggle"><?php _e( 'Menu', 'twentysixteen' ); ?></button>
					<div id="site-header-menu" class="site-header-menu">
						<?php if ( has_nav_menu( 'primary' ) ) : ?>
							<nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'twentysixteen' ); ?>">
								<?php
									wp_nav_menu( array(
										'theme_location' => 'primary',
										'menu_class'     => 'voce-menu',
									 ) );
								?>
							</nav><!-- .main-navigation -->
						<?php endif; ?>
					</div>
		
		
	</div>
	<section>
	<?php 
	$thumbnail = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), "full" );
	var_dump($thumbnail) ; 
	$slug = get_post_field( 'post_name', get_post() );
	var_dump($slug);
	?>
	blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
		blabla <br />
	</section>
	<section class="background-section">
		<div  class="background-overlay"></div>
		<div><h1>The Image</h1></div>
	</section>
	<section id="primary" class="content-area-wide">
		<main id="main" class="site-main">

			<?php
			$home = ''; // 'home'  si in particularise la page de blog
			$suffix = (is_front_page() ? '-front-page' : (is_home() ? $home :''));
			//echo "****"; echo $suffix;echo "****";
			/* Start the Loop */
			while ( have_posts() ) :
				the_post();

				get_template_part( 'template-parts/content/content', 'page'.$suffix );

				// If comments are open or we have at least one comment, load up the comment template.
				if ( comments_open() || get_comments_number() ) {
					comments_template();
				}

			endwhile; // End of the loop.
			?>

		</main><!-- #main -->

	</section><!-- #primary -->

<?php
get_footer();
?>
</div> <!-- main-et-footer -->



