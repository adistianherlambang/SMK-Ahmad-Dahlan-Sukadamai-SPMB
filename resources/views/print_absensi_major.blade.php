<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Daftar Hadir Siswa – {{ strtoupper($jurusan) }}</title>
  <style>
    @font-face {
      font-family: 'Calibri';
      src: url('{{ public_path("fonts/calibri.ttf") }}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Calibri';
      src: url('{{ public_path("fonts/calibrib.ttf") }}') format('truetype');
      font-weight: bold;
      font-style: normal;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Calibri', sans-serif;
      font-size: 11pt;
      color: #000;
      background: #fff;
    }

    @page {
      size: A4;
      margin: 20mm 20mm 15mm 25mm;
    }

    .class-sheet {
      page-break-inside: avoid;
    }

    .page-break {
      page-break-after: always;
    }

    /* ── Header ─────────────────────────────── */
    .header-table {
      width: 100%;
      border-collapse: collapse;
      border-bottom: 3px double #000;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }

    .header-table td {
      border: none;
      padding: 0;
    }

    .school-logo {
      width: 70px;
      height: 70px;
    }

    .school-info {
      text-align: center;
    }

    .school-name {
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .school-address {
      font-size: 9.5pt;
      margin-top: 3px;
    }

    .school-contact {
      font-size: 8.5pt;
      color: #444;
      margin-top: 2px;
    }

    /* ── Document Title ──────────────────────── */
    .doc-title {
      text-align: center;
      margin: 10px 0 15px;
    }

    .doc-title h2 {
      font-size: 13pt;
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ── Info Grid ──────────────────────────── */
    .info-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
      margin-bottom: 14px;
    }

    .info-table td {
      border: none;
      padding: 3px 0;
      vertical-align: top;
    }

    /* ── Table ──────────────────────────────── */
    table.daftar {
      width: 100%;
      border-collapse: collapse;
      font-size: 10pt;
      margin-top: 8px;
    }

    table.daftar thead tr th {
      border: 1px solid #000;
      padding: 6px 8px;
      text-align: center;
      font-weight: bold;
      background: #f0f0f0;
    }

    table.daftar tbody tr td {
      border: 1px solid #000;
      padding: 5px 8px;
      vertical-align: middle;
    }

    td.no    { text-align: center; width: 40px; }
    td.nis   { width: 100px; }
    td.nama  { }
    td.ttd   { width: 160px; height: 35px; }

    /* ── Signatures ─────────────────────────── */
    .sign-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 30px;
      font-size: 10pt;
    }

    .sign-table td {
      border: none;
      padding: 0;
      text-align: center;
      vertical-align: top;
    }
  </style>
</head>
<body>

  @forelse ($classroomsData as $index => $data)
    @php
      $classroom = $data['classroom'];
      $students = $data['students'];
    @endphp

    <div class="class-sheet">
      {{-- ── HEADER ─────────────────────────────────── --}}
      <table class="header-table">
        <tr>
          <td style="width: 70px; vertical-align: middle;">
            <img src="{{ public_path('mainLogo.png') }}" class="school-logo" alt="Logo">
          </td>
          <td class="school-info">
            <div class="school-name">SMK Ahmad Dahlan Sukadamai</div>
            <div class="school-address">Jl. Ahmad Dahlan No. 1, Sukadamai, Natar, Lampung Selatan, Lampung</div>
            <div class="school-contact">Telp: — &nbsp;|&nbsp; Email: smkad.sukadamai@gmail.com</div>
          </td>
          <td style="width: 70px;"></td>
        </tr>
      </table>

      {{-- ── DOCUMENT TITLE ──────────────────────────── --}}
      <div class="doc-title">
        <h2>Daftar Hadir Siswa</h2>
      </div>

      {{-- ── INFO ROWS ──────────────────────────────── --}}
      <table class="info-table">
        <tr>
          <td style="width: 130px;">Jurusan</td>
          <td style="width: 15px; text-align: center;">:</td>
          <td>{{ ucwords($jurusan) }}</td>
        </tr>
        <tr>
          <td>Kelas</td>
          <td style="text-align: center;">:</td>
          <td>{{ $classroom->name }}</td>
        </tr>
        <tr>
          <td>Tanggal</td>
          <td style="text-align: center;">:</td>
          <td><span style="border-bottom: 1px solid #000; display: inline-block; width: 180px;">&nbsp;</span></td>
        </tr>
      </table>

      {{-- ── TABLE ──────────────────────────────────── --}}
      <table class="daftar">
        <thead>
          <tr>
            <th style="width:40px;">No.</th>
            <th style="width:100px;">NIS</th>
            <th>Nama Siswa</th>
            <th style="width:160px;">Tanda Tangan</th>
          </tr>
        </thead>
        <tbody>
          @forelse ($students as $i => $student)
            <tr>
              <td class="no">{{ $i + 1 }}</td>
              <td class="nis">{{ $student->nis ?? '-' }}</td>
              <td class="nama">{{ $student->full_name }}</td>
              <td class="ttd"></td>
            </tr>
          @empty
            <tr>
              <td colspan="4" style="text-align:center; padding:20px; font-style:italic;">
                Tidak ada siswa untuk kelas ini.
              </td>
            </tr>
          @endforelse
        </tbody>
      </table>

      {{-- ── SIGNATURES ──────────────────────────────── --}}
      <table class="sign-table">
        <tr>
          {{-- Left side: Guru Mata Pelajaran --}}
          <td style="width: 50%;">
            <div style="margin-bottom: 50px;">&nbsp;</div>
            <div style="margin-bottom: 50px;">Guru Mata Pelajaran,</div>
            <div>(.................................)</div>
          </td>
          {{-- Right side: Kepala Sekolah --}}
          <td style="width: 50%;">
            <div>Mengetahui,</div>
            <div style="margin-bottom: 50px;">Kepala Sekolah,</div>
            <div><strong><u>Pujiono, S.E.I.</u></strong></div>
          </td>
        </tr>
      </table>
    </div>

    @if (!$loop->last)
      <div class="page-break"></div>
    @endif

  @empty
    <div style="text-align:center; padding:40px;">
      <h3>Tidak ada kelas atau data siswa ditemukan untuk kriteria pencarian ini.</h3>
    </div>
  @endforelse

</body>
</html>
