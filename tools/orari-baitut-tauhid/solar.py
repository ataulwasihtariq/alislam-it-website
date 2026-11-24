"""NOAA / Meeus solar position -> sunrise, sunset, solar noon. Pure python, no deps."""
import math, datetime as dt
from zoneinfo import ZoneInfo
LAT, LON = 44.7006, 11.4119   # San Pietro in Casale (BO)
TZ = ZoneInfo("Europe/Rome")

def _jd(y,m,d):
    if m<=2: y-=1; m+=12
    A=y//100; B=2-A+A//4
    return int(365.25*(y+4716))+int(30.6001*(m+1))+d+B-1524.5

def _sun(jc):
    L0=(280.46646+jc*(36000.76983+jc*0.0003032))%360
    M=357.52911+jc*(35999.05029-0.0001537*jc)
    e=0.016708634-jc*(0.000042037+0.0000001267*jc)
    C=(math.sin(math.radians(M))*(1.914602-jc*(0.004817+0.000014*jc))
       +math.sin(math.radians(2*M))*(0.019993-0.000101*jc)
       +math.sin(math.radians(3*M))*0.000289)
    true_long=L0+C
    om=125.04-1934.136*jc
    app=true_long-0.00569-0.00478*math.sin(math.radians(om))
    eps0=23+(26+((21.448-jc*(46.815+jc*(0.00059-jc*0.001813))))/60)/60
    eps=eps0+0.00256*math.cos(math.radians(om))
    decl=math.degrees(math.asin(math.sin(math.radians(eps))*math.sin(math.radians(app))))
    y=math.tan(math.radians(eps/2))**2
    eot=4*math.degrees(y*math.sin(2*math.radians(L0))-2*e*math.sin(math.radians(M))
        +4*e*y*math.sin(math.radians(M))*math.cos(2*math.radians(L0))
        -0.5*y*y*math.sin(4*math.radians(L0))-1.25*e*e*math.sin(2*math.radians(M)))
    return decl,eot

def day_times(date, lat=LAT, lon=LON, zenith=90.833):
    """returns dict of aware datetimes in Europe/Rome: sunrise, noon, sunset"""
    out={}
    def solve(event):
        t=0.5  # fraction of day UTC guess
        for _ in range(4):
            jc=(_jd(date.year,date.month,date.day)+t-2451545)/36525
            decl,eot=_sun(jc)
            ha=math.degrees(math.acos(math.cos(math.radians(zenith))/(math.cos(math.radians(lat))*math.cos(math.radians(decl)))
                 -math.tan(math.radians(lat))*math.tan(math.radians(decl))))
            noon_min=720-4*lon-eot
            minutes = noon_min if event=='noon' else (noon_min-4*ha if event=='rise' else noon_min+4*ha)
            t=minutes/1440
        return minutes
    for k,n in (('sunrise','rise'),('noon','noon'),('sunset','set')):
        m=solve(n)
        base=dt.datetime(date.year,date.month,date.day,tzinfo=dt.timezone.utc)
        out[k]=(base+dt.timedelta(minutes=m)).astimezone(TZ)
    return out
