export class OsDetectionService {

    public getOperatingSystem(): string {
      const userAgent = window.navigator.userAgent;
  
      if (userAgent.indexOf('Win') !== -1) return 'Windows';
      if (userAgent.indexOf('Mac') !== -1) return 'Mac OS';
      if (userAgent.indexOf('X11') !== -1) return 'UNIX';
      if (userAgent.indexOf('Linux') !== -1) return 'Linux';
  
      return 'Unknown OS';
    }
  }