'use strict'

LinkedDataDisplay.addService({
    name: 'Wikidata',
    isMatch: function(url) {
        return (null !== this.getMatch(url));
    },
    getEndpoint: function(url) {
        const match = this.getMatch(url);
        return `https://www.wikidata.org/wiki/Special:EntityData/${match[1]}.json`;
    },
    getMarkup: function(url, text) {
        const match = this.getMatch(url);
        const json = JSON.parse(text);
        const label = json['entities'][match[1]]['labels']['en']['value'];
        const description = json['entities'][match[1]]['descriptions']['en']['value'];
        return `
        <dl>
            <dt>Label</dt>
            <dd>${label}</dd>
            <dt>Description</dt>
            <dd>${description}</dd>
        </dl>`;
    },
    getMatch: function(url) {
        return url.match(/^https?:\/\/www\.wikidata\.org\/wiki\/(Q.+)/);
    }
});
LinkedDataDisplay.addService({
    name: 'Library of Congress Subject Headings',
    isMatch: function(url) {
        return (null !== this.getMatch(url));
    },
    getEndpoint: function(url) {
        const match = this.getMatch(url);
        return `http://id.loc.gov/authorities/subjects/${match[1]}.skos.json`;
    },
    getMarkup: function(url, text) {
        const match = this.getMatch(url);
        const json = JSON.parse(text);
        const prefLabel = json[0]['http://www.w3.org/2004/02/skos/core#prefLabel'][0]['@value'];
        const note = json[0]['http://www.w3.org/2004/02/skos/core#note'][0]['@value'];
        const altLabels = [];
        for (let altLabel of json[0]['http://www.w3.org/2008/05/skos-xl#altLabel']) {
            if (altLabel['@value']) {
                altLabels.push(altLabel['@value']);
            }
        }
        return `
        <dl>
            <dt>Label</dt>
            <dd>${prefLabel}</dd>
            <dt>Note</dt>
            <dd>${note}</dd>
            <dt>Alt labels</dt>
            <dd>${altLabels.join('; ')}</dd>
        </dl>`;
    },
    getMatch: function(url) {
        return url.match(/^http?:\/\/id.loc.gov\/authorities\/subjects\/(.+?)(\.html)?$/);
    }
});