<?php
/**
 * Plugin Name:       Template Library
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       elementskit-lite
 *
 * @package GkitTemplateLibrary
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
// function gkit_template_library_gkit_template_library_block_init() {
// 	register_block_type( __DIR__ . '/build/blocks/test' );
// }
// add_action( 'init', 'gkit_template_library_gkit_template_library_block_init' );

/**
 * Enqueue block editor only JavaScript and CSS.
 */
function gkit_template_library_admin_enqueue_scripts($screen) {
	// Enqueue block editor JS and CSS
	$editor_template_library = include plugin_dir_path( __FILE__ ) . 'build/library/editor-template-library.asset.php';
	if ( $screen === 'post.php' || $screen === 'post-new.php' || $screen === 'site-editor.php' ) {
		wp_enqueue_script(
			'gutenkit-editor-template-library',
			plugins_url('build/library/editor-template-library.js', __FILE__),
			$editor_template_library['dependencies'],
			$editor_template_library['version'],
			true
		);

		wp_enqueue_style(
			'gutenkit-editor-template-library',
			plugins_url('build/library/editor-template-library.css', __FILE__),
			array(),
			$editor_template_library['version']
		);
		// Google Roboto Font
		wp_enqueue_style(
			'gutenkit-google-fonts', 
			'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap'
		);
	}
}
add_action( 'admin_enqueue_scripts', 'gkit_template_library_admin_enqueue_scripts' );


function load_gutenkit_plugin() {
	delete_option( 'gutenkit_do_activation_redirect' );
}
add_action('activate_gutenkit-blocks-addon/gutenkit-blocks-addon.php', 'load_gutenkit_plugin', 999999);
