const hosts = import('//' + location.host + '/systemjs-config.php');
console.log('estos son los hooosts  - --> ', hosts);
export const HOSTS = hosts;