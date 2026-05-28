<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Bukti Pendaftaran - {{ $registration->registration_number }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #000;
            background-color: #fff;
            font-size: 14px;
            line-height: 1.4;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #ccc;
            padding: 30px;
            box-sizing: border-box;
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        .logo {
            width: 80px;
            height: 80px;
            background-color: #002147;
            color: #FDCD2D;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 24px;
            margin-right: 20px;
        }
        .header-text {
            flex: 1;
            text-align: center;
        }
        .header-text h1 {
            font-size: 18px;
            margin: 0 0 5px 0;
            text-transform: uppercase;
        }
        .header-text h2 {
            font-size: 20px;
            margin: 0 0 5px 0;
            color: #002147;
        }
        .header-text p {
            font-size: 12px;
            margin: 0;
            color: #555;
        }
        .divider {
            border-bottom: 3px double #000;
            margin: 15px 0;
        }
        .meta-info {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 25px;
        }
        .section-title {
            font-weight: bold;
            font-size: 15px;
            margin-top: 20px;
            margin-bottom: 8px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 4px;
            text-transform: uppercase;
            color: #002147;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        td {
            padding: 6px 4px;
            vertical-align: top;
        }
        td.label {
            width: 220px;
            font-weight: 500;
        }
        td.colon {
            width: 15px;
        }
        .footer-receipt {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            gap: 20px;
        }
        .requirements-box {
            border: 1px solid #000;
            padding: 12px;
            width: 60%;
            box-sizing: border-box;
            background-color: #F8F9FA;
        }
        .requirements-box h4 {
            margin: 0 0 8px 0;
            font-size: 13px;
            text-transform: uppercase;
        }
        .requirements-box ul {
            margin: 0;
            padding-left: 20px;
            font-size: 12px;
        }
        .signature-box {
            text-align: center;
            width: 35%;
        }
        .signature-space {
            height: 70px;
        }
        .print-btn-container {
            text-align: center;
            margin-bottom: 20px;
        }
        .print-btn {
            background-color: #002147;
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
        }
        @media print {
            .print-btn-container {
                display: none;
            }
            .container {
                border: none;
                padding: 0;
            }
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body onload="window.print()">
    <div class="print-btn-container">
        <button class="print-btn" onclick="window.print()">Cetak Halaman Ini</button>
    </div>
    
    <div class="container">
        <div class="header">
            <div class="logo">SMK AD</div>
            <div class="header-text">
                <h1>Dinas Pendidikan dan Kebudayaan</h1>
                <h2>SMK Ahmad Dahlan Sukadamai</h2>
                <p>Jl. KH Ahmad Dahlan No. 1 Sukadamai, Lampung Selatan</p>
            </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="meta-info">
            <span>NO REGISTRASI: {{ $registration->registration_number }}</span>
            <span>TANGGAL CETAK: {{ date('d F Y') }}</span>
        </div>
        
        <div class="section-title">A. Informasi Calon Peserta Didik</div>
        <table>
            <tr>
                <td class="label">Nama Lengkap</td>
                <td class="colon">:</td>
                <td>{{ $registration->full_name }}</td>
            </tr>
            <tr>
                <td class="label">NISN</td>
                <td class="colon">:</td>
                <td>{{ $registration->nisn }}</td>
            </tr>
            <tr>
                <td class="label">Jenis Kelamin</td>
                <td class="colon">:</td>
                <td>{{ $registration->gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
            </tr>
            <tr>
                <td class="label">Tempat / Tanggal Lahir</td>
                <td class="colon">:</td>
                <td>{{ $registration->birth_place }} / {{ date('d-m-Y', strtotime($registration->birth_date)) }}</td>
            </tr>
            <tr>
                <td class="label">Agama</td>
                <td class="colon">:</td>
                <td>{{ $registration->religion }}</td>
            </tr>
            <tr>
                <td class="label">Anak Ke-</td>
                <td class="colon">:</td>
                <td>{{ $registration->child_order }}</td>
            </tr>
            <tr>
                <td class="label">Status dalam Keluarga</td>
                <td class="colon">:</td>
                <td>{{ $registration->family_status }}</td>
            </tr>
            <tr>
                <td class="label">Jalur Masuk</td>
                <td class="colon">:</td>
                <td>{{ $registration->quota->name }}</td>
            </tr>
        </table>
        
        <div class="section-title">B. Keterangan Orang Tua / Wali</div>
        <table>
            <tr>
                <td class="label">Nama Orang Tua / Wali</td>
                <td class="colon">:</td>
                <td>{{ $registration->parent_name }}</td>
            </tr>
            <tr>
                <td class="label">Pekerjaan</td>
                <td class="colon">:</td>
                <td>{{ $registration->parent_occupation }}</td>
            </tr>
            <tr>
                <td class="label">Status Hubungan</td>
                <td class="colon">:</td>
                <td>{{ $registration->parent_status }}</td>
            </tr>
        </table>
        
        <div class="section-title">C. Keterangan Asal Sekolah</div>
        <table>
            <tr>
                <td class="label">Nama Sekolah Asal</td>
                <td class="colon">:</td>
                <td>{{ $registration->school_origin }}</td>
            </tr>
            <tr>
                <td class="label">Alamat Sekolah Asal</td>
                <td class="colon">:</td>
                <td>{{ $registration->school_address }}</td>
            </tr>
        </table>
        
        <div class="section-title">D. Kontak & Alamat Calon Siswa</div>
        <table>
            <tr>
                <td class="label">Nomor Telepon / HP</td>
                <td class="colon">:</td>
                <td>{{ $registration->phone_number }}</td>
            </tr>
            <tr>
                <td class="label">Alamat Domisili</td>
                <td class="colon">:</td>
                <td>{{ $registration->address }}</td>
            </tr>
        </table>
        
        <div class="footer-receipt">
            <div class="requirements-box">
                <h4>Syarat Dokumen Fisik Bawaan:</h4>
                <ul>
                    <li>Fotokopi Kartu Keluarga (KK) - 2 Lembar</li>
                    <li>Fotokopi Akta Kelahiran - 2 Lembar</li>
                    <li>Fotokopi SKHU / SKL Terlegalisir - 2 Lembar</li>
                    @if($registration->quota->name === 'Jalur Afirmasi')
                    <li>Fotokopi SKTM / KIP / PKH - 2 Lembar</li>
                    @endif
                    <li>Cetak Bukti Pendaftaran Online Ini</li>
                </ul>
            </div>
            
            <div class="signature-box">
                <p>Mengetahui,</p>
                <p>Orangtua/Wali Calon Siswa</p>
                <div class="signature-space"></div>
                <p>( .................................................... )</p>
            </div>
        </div>
    </div>
</body>
</html>
