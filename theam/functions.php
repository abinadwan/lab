<?php
function aladwan_child_setup() {
    // دعم الصور المميزة، العناوين، RTL
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('html5', ['search-form', 'comment-list', 'gallery', 'caption']);
    add_theme_support('align-wide');
    add_theme_support('custom-logo', [
        'height'      => 169,
        'width'       => 89,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    load_theme_textdomain('aladwan-pro', get_template_directory() . '/languages');
}
add_action('after_setup_theme', 'aladwan_child_setup');

// تحميل CSS و JS
function aladwan_child_assets() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/css/style.css');
    wp_enqueue_script('swiper-js', get_stylesheet_directory_uri() . '/js/swiper-bundle.min.js', [], '10.3.1', true);
    wp_enqueue_script('child-main', get_stylesheet_directory_uri() . '/js/main.js', ['jquery'], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'aladwan_child_assets');
