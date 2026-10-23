
export const featureImportance = [
    {
        id: 'has_at',
        value: 0.0001035442578247571,
        label: 'Has At Symbol',
        section: 'host',
    },
    {
        id: 'has_port',
        value: 0.01840302053475708,
        label: 'Uses Port Number',
        section: 'host',
    },
    {
        id: 'has_encoding',
        value: 0.3595389715148631,
        label: 'Has Encoding',
        section: 'path',
    },
    {
        id: 'is_shortener',
        value: 0.4475799826955359,
        label: 'Uses Shortener',
        section: 'host',
    },
    {
        id: 'brand_not_in_domain',
        value: 1.228087481722858,
        label: 'Brand Not In Domain',
        section: 'host',
    },
    {
        id: 'num_special',
        value: 3.182251713451051,
        label: 'Special Characters',
        section: 'symbols',
    },
    {
        id: 'suspicious_tld',
        value: 3.385918786299235,
        label: 'Suspicious TLD',
        section: 'words',
    },
    {
        id: 'has_ip',
        value: 4.27283556187476,
        label: 'IP Address',
        section: 'host',
    },
    {
        id: 'suspicious_words',
        value: 5.724838665774835,
        label: 'Suspicious Words',
        section: 'words',
    },
    {
        id: 'num_hyphens_host',
        value: 6.94187492052126,
        label: 'Hyphens In Host',
        section: 'host',
    },
    {
        id: 'num_digits',
        value: 7.992268545374293,
        label: 'Digits',
        section: 'symbols',
    },
    {
        id: 'url_length',
        value: 8.04323181709766,
        label: 'URL Length',
        section: 'length',
    },
    {
        id: 'host_entropy',
        value: 8.059334350473815,
        label: 'Host Entropy',
        section: 'host',
    },
    {
        id: 'host_length',
        value: 8.125989549116937,
        label: 'Host Length',
        section: 'length',
    },
    {
        id: 'path_depth',
        value: 8.32097566333227,
        label: 'Path Depth',
        section: 'path',
    },
    {
        id: 'digit_ratio',
        value: 8.587043942502266,
        label: 'Digit Ratio',
        section: 'symbols',
    },
    {
        id: 'path_length',
        value: 10.31307746142232,
        label: 'Path Length',
        section: 'length',
    },
    {
        id: 'num_dots_host',
        value: 14.99664602203346,
        label: 'Dots in Host',
        section: 'host',
    },
]

export const largeFeatureImportance = [
    {
        id: 'other',
        value: 0.0001035442578247571+0.01840302053475708+0.3595389715148631+0.4475799826955359,
        label: 'Other',
    },
    {
        id: 'brand_not_in_domain',
        value: 1.228087481722858,
        label: 'Brand Not In Domain',
    },
    {
        id: 'num_special',
        value: 3.182251713451051,
        label: 'Special Characters',
    },
    {
        id: 'suspicious_tld',
        value: 3.385918786299235,
        label: 'Suspicious TLD',
    },
    {
        id: 'has_ip',
        value: 4.27283556187476,
        label: 'IP Address',
    },
    {
        id: 'suspicious_words',
        value: 5.724838665774835,
        label: 'Suspicious Words',
    },
    {
        id: 'num_hyphens_host',
        value: 6.94187492052126,
        label: 'Hyphens In Host',
    },
    {
        id: 'num_digits',
        value: 7.992268545374293,
        label: 'Digits',
    },
    {
        id: 'url_length',
        value: 8.04323181709766,
        label: 'URL Length',
    },
    {
        id: 'host_entropy',
        value: 8.059334350473815,
        label: 'Host Entropy',
    },
    {
        id: 'host_length',
        value: 8.125989549116937,
        label: 'Host Length',
    },
    {
        id: 'path_depth',
        value: 8.32097566333227,
        label: 'Path Depth',
    },
    {
        id: 'digit_ratio',
        value: 8.587043942502266,
        label: 'Digit Ratio',
    },
    {
        id: 'path_length',
        value: 10.31307746142232,
        label: 'Path Length',
    },
    {
        id: 'num_dots_host',
        value: 14.99664602203346,
        label: 'Dots in Host',
    },
]

export const smallFeatureImportance = [
    {
        id: 'has_at',
        value: 0.0001035442578247571,
        label: 'Has At Symbol',
    },
    {
        id: 'has_port',
        value: 0.01840302053475708,
        label: 'Uses Port Number',
    },
    {
        id: 'has_encoding',
        value:  0.3595389715148631,
        label: 'Has Encoding',
    },
    {
        id: 'is_shortener',
        value: 0.4475799826955359,
        label: 'Uses Shortener',
    },
]

export const bypartFeatureImportance = [
    {
        id: 'domain_feats',
        value: 
        0.01840302053475708+0.4475799826955359+1.228087481722858
        +3.385918786299235+4.27283556187476+6.94187492052126
        +8.059334350473815+8.125989549116937+14.99664602203346,
        label: 'Domain Features',
    }
]