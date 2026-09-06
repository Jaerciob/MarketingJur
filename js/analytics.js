(function () {
    'use strict';

    function trackEvent(name, data) {
        if (typeof window === 'undefined') return;

        try {
            if (window.umami && typeof window.umami.track === 'function') {
                window.umami.track(name, data);
            }
        } catch (error) {
            // Analytics should never interrupt the visitor experience.
        }
    }

    window.marketingJurAnalytics = {
        trackEvent: trackEvent
    };

    document.addEventListener('click', function (event) {
        var button = event.target.closest ? event.target.closest('button') : null;
        if (!button || !button.id) return;

        var id = button.id;
        var action = null;
        var tool = null;

        if (id.indexOf('btn-save-') === 0) {
            action = 'save';
            tool = id.slice('btn-save-'.length);
        } else if (id.indexOf('btn-print-') === 0 || id === 'pf-btn-print') {
            action = 'print';
            tool = id === 'pf-btn-print' ? 'plano-funil' : id.slice('btn-print-'.length);
        } else if (id.indexOf('btn-load-') === 0) {
            action = 'load_example';
            tool = id.slice('btn-load-'.length);
        } else if (id.indexOf('btn-add-') === 0) {
            action = 'add_item';
            tool = id.slice('btn-add-'.length);
        }

        if (action && tool) {
            trackEvent('tool_action_used', {
                action: action,
                tool: tool
            });
        }
    });
})();