<?php

namespace Drupal\inline_funnel\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides an inline funnel block.
 *
 * @Block(
 *   id = "inline_funnel",
 *   admin_label = @Translation("Inline Funnel"),
 *   category = @Translation("Funnels"),
 * )
 */
class InlineFunnel extends BlockBase implements BlockPluginInterface
{
    /**
     * {@inheritdoc}
     */
    public function build()
    {
        $config = $this->getConfiguration();

        if (isset($config['funnel_host'])) {

            $funnelParams = [
                'fcon' => empty($config['funnel_fcon']) ? null : $config['funnel_fcon'],
            ];

            return [
                '#markup' => '<div id="funnel"></div>',
                '#attached' => [
                    'library' => [
                        'inline_funnel/inline_funnel',
                    ],
                    'drupalSettings' => [
                        'inline_funnel' => [
                            'funnel_host' => $config['funnel_host'],
                            'funnel_params' => array_filter($funnelParams),
                        ],
                    ],
                ],
            ];
        }

        return [];
    }

    /**
     * {@inheritdoc}
     */
    public function blockForm($form, FormStateInterface $form_state)
    {
        $form = parent::blockForm($form, $form_state);

        $config = $this->getConfiguration();

        $form['funnel_host'] = [
            '#type' => 'textfield',
            '#title' => $this->t('Funnel host'),
            '#required' => TRUE,
            '#description' => $this->t('What is the hostname of the inline funnel? (Includes http(s) prefix).'),
            '#default_value' => $config['funnel_host'] ?? '',
        ];

        $form['funnel_fcon'] = [
            '#type' => 'textfield',
            '#title' => $this->t('Optional fcon parameter'),
            '#description' => $this->t('Add an optional fcon parameter to the inline funnel.'),
            '#default_value' => $config['funnel_fcon'] ?? '',
        ];

        return $form;
    }

    /**
     * {@inheritdoc}
     */
    public function blockSubmit($form, FormStateInterface $form_state)
    {
        parent::blockSubmit($form, $form_state);
        $values = $form_state->getValues();
        $this->configuration['funnel_host'] = $values['funnel_host'];
        $this->configuration['funnel_fcon'] = $values['funnel_fcon'];
    }
}
