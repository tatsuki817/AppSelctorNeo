import { useState, useEffect } from 'react';
import { OSType } from '../types';

export const useOperatingSystem = (): OSType => {
  const [os, setOs] = useState<OSType>(OSType.UNKNOWN);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    if (/windows phone/i.test(userAgent)) {
      setOs(OSType.WINDOWS_PHONE);
    } else if (/android/i.test(userAgent)) {
      setOs(OSType.ANDROID);
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      setOs(OSType.IOS);
    } else {
      setOs(OSType.UNKNOWN);
    }
  }, []);

  return os;
};