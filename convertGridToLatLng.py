import math
def convertENtoLatLng(E,N):
	E = int(E)
	N = int(N)
	a = 6377563.396
	b = 6356256.909			  #Airy 1830 major & minor semi-axes
	F0 = 0.9996012717							 #NatGrid scale factor on central meridian
	φ0 = math.radians(49)
	λ0 = math.radians(-2)  #NatGrid true origin is 49°N,2°W
	N0 = -100000 
	E0 = 400000					 #northing & easting of true origin, metres
	e2 = 1 - (b*b)/(a*a)						 #eccentricity squared
	n = (a-b)/(a+b)
	n2 = n*n
	n3 = n*n*n		 #n, n², n³

	φ=φ0
	M=0
	while (N-N0-M >= 0.00001):
		φ = (N-N0-M)/(a*F0) + φ
		Ma = (1 + n + (5/4)*n2 + (5/4)*n3) * (φ-φ0)
		Mb = (3*n + 3*n*n + (21/8)*n3) * math.sin(φ-φ0) * math.cos(φ+φ0)
		Mc = ((15/8)*n2 + (15/8)*n3) * math.sin(2*(φ-φ0)) * math.cos(2*(φ+φ0))
		Md = (35/24)*n3 * math.sin(3*(φ-φ0)) * math.cos(3*(φ+φ0))
		M = b * F0 * (Ma - Mb + Mc - Md)			  #meridional arc

	#ie until < 0.01mm

	cosφ = math.cos(φ)
	sinφ = math.sin(φ)
	ν = a*F0/math.sqrt(1-e2*sinφ*sinφ)			#nu = transverse radius of curvature
	ρ = a*F0*(1-e2)/math.pow(1-e2*sinφ*sinφ, 1.5) #rho = meridional radius of curvature
	η2 = ν/ρ-1									#eta = ?

	tanφ = math.tan(φ)
	tan2φ = tanφ*tanφ
	tan4φ = tan2φ*tan2φ
	tan6φ = tan4φ*tan2φ
	secφ = 1/cosφ
	ν3 = ν*ν*ν
	ν5 = ν3*ν*ν
	ν7 = ν5*ν*ν
	VII = tanφ/(2*ρ*ν)
	VIII = tanφ/(24*ρ*ν3)*(5+3*tan2φ+η2-9*tan2φ*η2)
	IX = tanφ/(720*ρ*ν5)*(61+90*tan2φ+45*tan4φ)
	X = secφ/ν
	XI = secφ/(6*ν3)*(ν/ρ+2*tan2φ)
	XII = secφ/(120*ν5)*(5+28*tan2φ+24*tan4φ)
	XIIA = secφ/(5040*ν7)*(61+662*tan2φ+1320*tan4φ+720*tan6φ)

	dE = (E-E0)
	dE2 = dE*dE
	dE3 = dE2*dE
	dE4 = dE2*dE2
	dE5 = dE3*dE2
	dE6 = dE4*dE2
	dE7 = dE5*dE2
	φ = φ - VII*dE2 + VIII*dE4 - IX*dE6
	λ = λ0 + X*dE - XI*dE3 + XII*dE5 - XIIA*dE7
	return [math.degrees(φ), math.degrees(λ)]