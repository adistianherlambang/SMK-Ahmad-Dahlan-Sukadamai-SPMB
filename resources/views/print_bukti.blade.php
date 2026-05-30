<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>{{ $registration->graduation_status === 'Diterima' ? 'Bukti Penerimaan' : 'Bukti Pendaftaran' }} - {{ $registration->registration_number }}</title>
    <style>
        @page {
            size: a4 portrait;
            margin: 25mm 20mm 20mm 20mm;
        }
        body {
            font-family: 'Helvetica', Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #000;
            background-color: #fff;
            font-size: 11px;
            line-height: 1.35;
        }
        .container {
            width: 100%;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
        }
        .logo-cell {
            width: 70px;
            vertical-align: middle;
        }
        .logo {
            width: 60px;
            height: 60px;
            background-color: #002147;
            color: #FDCD2D;
            border-radius: 50%;
            text-align: center;
            line-height: 60px;
            font-weight: bold;
            font-size: 16px;
        }
        .header-text-cell {
            text-align: center;
            vertical-align: middle;
        }
        .header-text-cell h1 {
            font-size: 13px;
            margin: 0 0 2px 0;
            text-transform: uppercase;
            font-weight: normal;
            letter-spacing: 0.5px;
            color: #333;
        }
        .header-text-cell h2 {
            font-size: 17px;
            margin: 0 0 4px 0;
            color: #002147;
            font-weight: bold;
        }
        .header-text-cell p {
            font-size: 10px;
            margin: 0;
            color: #555;
        }
        .divider {
            border-top: 1px solid #000;
            border-bottom: 3px double #000;
            height: 2px;
            margin: 10px 0 15px 0;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .meta-table td {
            font-size: 10px;
            font-weight: bold;
            color: #333;
        }
        .section-title {
            font-weight: bold;
            font-size: 11px;
            margin-top: 12px;
            margin-bottom: 6px;
            border-bottom: 2px solid #002147;
            padding-bottom: 3px;
            text-transform: uppercase;
            color: #002147;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 8px;
        }
        .data-table td {
            padding: 3.5px 2px;
            vertical-align: top;
            font-size: 10.5px;
        }
        .data-table td.label {
            width: 180px;
            color: #444;
        }
        .data-table td.colon {
            width: 15px;
            text-align: center;
            color: #444;
        }
        .data-table td.value {
            color: #000;
            font-weight: 500;
        }
        .footer-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 25px;
        }
        .footer-table td {
            vertical-align: top;
        }
        .requirements-box {
            border: 1px solid #ddd;
            padding: 10px;
            background-color: #fafafa;
            border-radius: 4px;
        }
        .requirements-box-success {
            border: 1px solid #c3e6cb;
            padding: 10px;
            background-color: #f4faf5;
            border-radius: 4px;
        }
        .requirements-box h4 {
            margin: 0 0 5px 0;
            font-size: 10.5px;
            color: #002147;
            text-transform: uppercase;
            font-weight: bold;
        }
        .requirements-box-success h4 {
            margin: 0 0 5px 0;
            font-size: 10.5px;
            color: #155724;
            text-transform: uppercase;
            font-weight: bold;
        }
        .requirements-box ul, .requirements-box-success ul {
            margin: 0;
            padding-left: 15px;
            font-size: 9.5px;
            color: #444;
            line-height: 1.4;
        }
        .signature-box {
            text-align: center;
            font-size: 10.5px;
            color: #333;
        }
        .status-alert-success {
            border: 1px solid #c3e6cb;
            padding: 10px;
            background-color: #d4edda;
            color: #155724;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 11px;
            line-height: 1.4;
        }
        .status-alert-info {
            border: 1px solid #ffeeba;
            padding: 10px;
            background-color: #fff3cd;
            color: #856404;
            border-radius: 4px;
            margin-bottom: 15px;
            font-size: 11px;
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <table class="header-table">
            <tr>
                <td class="logo-cell">
                    <div class="logo">SMK AD</div>
                </td>
                <td class="header-text-cell">
                    <h1>Dinas Pendidikan dan Kebudayaan</h1>
                    <h2>SMK Ahmad Dahlan Sukadamai</h2>
                    <p>Jl. KH Ahmad Dahlan No. 1 Sukadamai, Lampung Selatan</p>
                </td>
                <td style="width: 70px;"></td> <!-- Spacer balance -->
            </tr>
        </table>
        
        <!-- Double Divider Line -->
        <div class="divider"></div>
        
        <!-- Meta Details -->
        <table class="meta-table">
            <tr>
                <td style="text-align: left; font-size: 11px;">
                    DOKUMEN: {{ $registration->graduation_status === 'Diterima' ? 'BUKTI PENERIMAAN' : 'BUKTI PENDAFTARAN' }}
                </td>
                <td style="text-align: right; font-size: 11px;">
                    TANGGAL CETAK: {{ date('d F Y') }}
                </td>
            </tr>
        </table>

        <!-- Dynamic Status Alert Message -->
        @if($registration->graduation_status === 'Diterima')
            <div class="status-alert-success">
                <strong>Selamat! Anda Dinyatakan Lulus Seleksi.</strong><br>
                Berdasarkan hasil rapat pleno panitia penerimaan siswa baru, Anda secara resmi dinyatakan <strong>DITERIMA</strong> sebagai siswa baru di SMK Ahmad Dahlan Sukadamai Tahun Pelajaran {{ date('Y') }}/{{ date('Y') + 1 }}. Silakan lakukan daftar ulang fisik sesuai jadwal.
            </div>
        @else
            <div class="status-alert-info">
                <strong>Bukti Registrasi Pendaftaran Online.</strong><br>
                Simpan bukti pendaftaran ini sebagai tanda bukti pengajuan berkas pendaftaran Anda secara online. Harap bawa bukti ini beserta dokumen pendukung saat verifikasi fisik di sekolah.
            </div>
        @endif
        
        <!-- Section A -->
        <div class="section-title">A. Informasi Calon Peserta Didik</div>
        <table class="data-table">
            <tr>
                <td class="label">Nomor Registrasi</td>
                <td class="colon">:</td>
                <td class="value" style="font-weight: bold; color: #002147;">{{ $registration->registration_number }}</td>
            </tr>
            <tr>
                <td class="label">Nama Lengkap</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->full_name }}</td>
            </tr>
            <tr>
                <td class="label">NISN</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->nisn }}</td>
            </tr>
            <tr>
                <td class="label">Jenis Kelamin</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->gender == 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
            </tr>
            <tr>
                <td class="label">Tempat / Tanggal Lahir</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->birth_place }} / {{ date('d-m-Y', strtotime($registration->birth_date)) }}</td>
            </tr>
            <tr>
                <td class="label">Agama</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->religion }}</td>
            </tr>
            <tr>
                <td class="label">Anak Ke-</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->child_order }}</td>
            </tr>
            <tr>
                <td class="label">Status dalam Keluarga</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->family_status }}</td>
            </tr>
            <tr>
                <td class="label">Jalur Masuk</td>
                <td class="colon">:</td>
                <td class="value" style="font-weight: bold;">{{ $registration->quota->name }}</td>
            </tr>
        </table>
        
        <!-- Section B -->
        <div class="section-title">B. Keterangan Orang Tua / Wali</div>
        <table class="data-table">
            <tr>
                <td class="label">Nama Orang Tua / Wali</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->parent_name }}</td>
            </tr>
            <tr>
                <td class="label">Pekerjaan</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->parent_occupation }}</td>
            </tr>
            <tr>
                <td class="label">Status Hubungan</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->parent_status }}</td>
            </tr>
        </table>
        
        <!-- Section C -->
        <div class="section-title">C. Keterangan Asal Sekolah</div>
        <table class="data-table">
            <tr>
                <td class="label">Nama Sekolah Asal</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->school_origin }}</td>
            </tr>
            <tr>
                <td class="label">Alamat Sekolah Asal</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->school_address }}</td>
            </tr>
        </table>
        
        <!-- Section D -->
        <div class="section-title">D. Kontak & Alamat Calon Siswa</div>
        <table class="data-table">
            <tr>
                <td class="label">Nomor Telepon / HP</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->phone_number }}</td>
            </tr>
            <tr>
                <td class="label">Alamat Domisili</td>
                <td class="colon">:</td>
                <td class="value">{{ $registration->address }}</td>
            </tr>
        </table>
        
        <!-- Footer / Action box and signature -->
        <table class="footer-table">
            <tr>
                <!-- Left requirements column -->
                <td style="width: 55%;">
                    @if($registration->graduation_status === 'Diterima')
                        <div class="requirements-box-success">
                            <h4>Syarat Daftar Ulang Fisik Bawaan:</h4>
                            <ul>
                                <li>Membawa Cetak Bukti Penerimaan Online ini</li>
                                <li>Fotokopi Kartu Keluarga (KK) - 2 Lembar</li>
                                <li>Fotokopi Akta Kelahiran - 2 Lembar</li>
                                <li>Fotokopi Ijazah / SKL Terlegalisir - 2 Lembar</li>
                                <li>Pas Foto hitam putih ukuran 3x4 - 2 Lembar</li>
                                <li>Semua berkas dimasukkan ke dalam Map Kuning (Laki-laki) atau Map Merah (Perempuan)</li>
                            </ul>
                        </div>
                    @else
                        <div class="requirements-box">
                            <h4>Syarat Verifikasi Berkas Fisik:</h4>
                            <ul>
                                <li>Membawa Cetak Bukti Pendaftaran ini</li>
                                <li>Fotokopi Kartu Keluarga (KK) - 2 Lembar</li>
                                <li>Fotokopi Akta Kelahiran - 2 Lembar</li>
                                <li>Fotokopi SKHU / SKL Terlegalisir - 2 Lembar</li>
                                @if($registration->quota->name === 'Jalur Afirmasi')
                                    <li>Fotokopi SKTM / KIP / PKH - 2 Lembar</li>
                                @endif
                                <li>Semua dokumen dimasukkan ke dalam stopmap</li>
                            </ul>
                        </div>
                    @endif
                </td>
                
                <!-- Right signature column -->
                <td style="width: 45%; padding-left: 30px;">
                    <div class="signature-box">
                        <p style="margin: 0 0 2px 0;">Mengetahui,</p>
                        <p style="margin: 0 0 45px 0;">Orangtua/Wali Calon Siswa</p>
                        <p style="margin: 0; font-weight: bold;">( .................................................... )</p>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
