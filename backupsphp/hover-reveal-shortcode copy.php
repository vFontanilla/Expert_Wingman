<?php
/**
 * Plugin Name: Hover Reveal Shortcode
 * Description: A shortcode to create a hover-to-reveal grid effect for speakers.
 * Version: 1.1
 * Author: Wingman Group
 */

if (!defined('ABSPATH')) exit; // Exit if accessed directly

// Register Shortcode
function hover_reveal_shortcode() {
    ob_start();
    ?>
    <style>
        @font-face {
            font-family: 'Gotham';
            src: url('../fonts/Gotham.woff2') format('woff2'),
                url('../fonts/Gotham.woff') format('woff'),
                url('../fonts/Gotham.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        .hover-reveal-grid {
            display: grid;  
            grid-template-columns: repeat(3, 1fr);
            align-items: stretch;;
            justify-content: center;
            gap: 20px;
            grid-auto-flow: row;
            height: 100%;
        }
        .grid-item {
            display: flex;
            flex-direction: column;
            min-height: 300px;
            width: 100%;
            padding: 10px;
        }
        .grid-item img {
            object-fit: cover;
            width: 100%;
            height: auto;
        }
        @media (max-width: 768px) {
            .hover-reveal-grid {
                grid-template-columns: repeat(2, 1fr); /* One column for mobile */
            }
            .grid-item img {
                width: 100%; /* Ensure images take full width of the container */
                height: auto; /* Maintain aspect ratio */
            }
            .grid-item {
                min-height: 250px;
            }
        }
        .grid-item h2 {
            color: #FFAE00;
            text-align: center;
            font-family: 'Gotham', sans-serif !important;
            font-weight: 600 !important;
            font-style: normal;
            padding-top: 020px;
            margin-bottom: 0;
        }
        .grid-item p {
            color: #FFFFFF;
            text-align: center;
            font-family: 'Gotham', sans-serif !important;
            font-weight: 400 !important;
            font-style: normal;
            margin-top: 0;
        }
    </style>

    <div class="hover-reveal-grid">
        <div class="grid-item" onclick="flipCard(this)">
            <div class="card">
                <!-- Front of the card -->
                <div class="card-front">
                    <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/1st.webp'); ?>" alt="1st.webp">
                    <h2>John McGrath</h2>
                    <p>Founder Mcgrath</p>
                </div>
                <!-- Back of the card -->
                <div class="card-back">
                    <h2>John McGrath</h2>
                    <h3>How to Build a Real Estate Empire</h3>
                    <p> Ever wondered how a small suburban agency grows into a household name? John McGrath did just
                        that-and he's revealing how. From assembling a powerhouse team to creating a culture of
                        excellence, John will break down the strategies that took his business from local to national success.
                        Expect game-changing insights on leadership, scaling, client experience, and the systems that
                        made it all possible. If you're serious about growth, this is one session you can't afford to miss.
                    </p>
                </div>
            </div>
        </div>

        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/2nd.webp'); ?>" alt="2nd.webp">
            <h2>Gavin Rubinstein</h2>
            <p>Director TRG</p>
        </div>

        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/3rd.webp'); ?>" alt="3rd.webp">    
            <h2>Leanne Pilkington</h2>
            <p>CEO Laing+Simmons</p>
        </div>

        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/4th.webp'); ?>" alt="4th.webp">
            <h2>Charles Tarbey</h2>
            <p>Chairman of Century 21 Australasia</p>
        </div>

        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/5th.webp'); ?>" alt="5th.webp">
            <h2>Matt Lahood</h2>
            <p>CEO The Agency</p>
        </div>

        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/6th.webp'); ?>" alt="6th.webp">
            <h2>Phil Harris</h2>
            <p>Director Harris Real Estate</p>
        </div>

        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/7th.webp'); ?>" alt="7th.webp">
            <h2>Tom Hawley</h2>
            <p>Director Azura Financial</p>
        </div>

        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/8th.webp'); ?>" alt="8th.webp">
            <h2>Nick Georges</h2>
            <p>Director Wingman</p>
        </div>

        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/9th.webp'); ?>" alt="9th.webp">
            <h2>Jonny Bell</h2>
            <p>Founder Housemark, Wingman</p>
        </div>
        
        <div class="grid-item">
            <img  src="<?php echo esc_url(plugin_dir_url(__FILE__) . 'public/10th.webp'); ?>" alt="10th.webp">
            <h2>Clayton Orrigo</h2>
            <p>Founder, The Hudson Advisory Team</p>
        </div>
    </div>
    <?php
    return ob_get_clean();
}

add_shortcode('hover_reveal', 'hover_reveal_shortcode');

// Enqueue CSS
function hover_reveal_styles() {
    wp_enqueue_style('hover-reveal-css', plugin_dir_url(__FILE__) . 'hover-reveal.css');
}

add_action('wp_enqueue_scripts', 'hover_reveal_styles');
?>
