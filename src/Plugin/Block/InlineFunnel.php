<?php

namespace Drupal\inline_funnel\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Block\BlockPluginInterface;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides a 'Hello' Block.
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
        //dd($config);
        //var_dump($config); die;
        if (isset($config['funnel_host'])) {
            return [
                '#markup' => $this->t('Hello, World!'),
                '#attached' => [
                    'library' => [
                        'inline_funnel/inline_funnel',
                    ],
                    'drupalSettings' => ['inline_funnel' => ['funnel_host' => $config['funnel_host']]]
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
            '#description' => $this->t('What is the hostname of the inline funnel? (Includes http(s) prefix).'),
            '#default_value' => $config['funnel_host'] ?? '',
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
    }
}
