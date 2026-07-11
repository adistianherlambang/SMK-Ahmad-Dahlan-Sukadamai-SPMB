<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Daftar Hadir Siswa – {{ strtoupper($jurusan) }} Kelas {{ $kelas }}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      color: #000;
      background: #fff;
      padding: 20mm 20mm 15mm 25mm;
    }

    /* ── Header ─────────────────────────────── */
    .school-header {
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 3px double #000;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }

    .school-logo {
      width: 70px;
      height: 70px;
      object-fit: contain;
      flex-shrink: 0;
    }

    .school-logo-placeholder {
      width: 70px;
      height: 70px;
      border: 1px solid #aaa;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8pt;
      color: #888;
      flex-shrink: 0;
    }

    .school-info {
      text-align: center;
      flex: 1;
    }

    .school-name {
      font-size: 17pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      line-height: 1.2;
    }

    .school-address {
      font-size: 10pt;
      margin-top: 3px;
    }

    .school-contact {
      font-size: 9pt;
      color: #444;
      margin-top: 2px;
    }

    /* ── Document Title ──────────────────────── */
    .doc-title {
      text-align: center;
      margin: 16px 0 12px;
    }

    .doc-title h2 {
      font-size: 14pt;
      font-weight: bold;
      text-decoration: underline;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ── Info Grid ──────────────────────────── */
    .info-grid {
      display: grid;
      grid-template-columns: 150px 10px 1fr;
      gap: 3px 0;
      font-size: 11pt;
      margin-bottom: 14px;
    }

    .info-grid .label  { font-weight: normal; }
    .info-grid .sep    { text-align: center; }
    .info-grid .value  { font-weight: normal; }

    .mapel-value {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .mapel-dots {
      flex: 1;
      border-bottom: 1px solid #000;
      min-width: 80px;
    }

    /* ── Table ──────────────────────────────── */
    table.daftar {
      width: 100%;
      border-collapse: collapse;
      font-size: 11pt;
      margin-top: 8px;
    }

    table.daftar thead tr th {
      border: 1px solid #000;
      padding: 6px 8px;
      text-align: center;
      font-weight: bold;
      background: #f0f0f0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    table.daftar tbody tr td {
      border: 1px solid #000;
      padding: 4px 8px;
      vertical-align: middle;
    }

    td.no    { text-align: center; width: 40px; }
    td.nis   { width: 100px; }
    td.nama  { }
    td.ttd   { width: 160px; height: 38px; }

    /* ── Footer ─────────────────────────────── */
    .sign-area {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
      font-size: 11pt;
    }

    .sign-block {
      text-align: center;
      width: 200px;
    }

    .sign-line {
      margin-top: 50px;
      border-top: 1px solid #000;
      padding-top: 4px;
    }

    /* ── Print ──────────────────────────────── */
    @media print {
      body { padding: 0; }
      @page { size: A4; margin: 20mm 20mm 15mm 25mm; }
    }
  </style>
</head>
<body>

  {{-- ── HEADER ─────────────────────────────────── --}}
  <div class="school-header">
    <img src="{{ asset('mainLogo.png') }}" alt="Logo SMK" class="school-logo">

    <div class="school-info">
      <div class="school-name">SMK Ahmad Dahlan Sukadamai</div>
      <div class="school-address">Jl. Ahmad Dahlan No. 1, Sukadamai, Natar, Lampung Selatan, Lampung</div>
      <div class="school-contact">Telp: — &nbsp;|&nbsp; Email: smkad.sukadamai@gmail.com</div>
    </div>

    <div style="width: 70px; flex-shrink: 0;"></div>
  </div>

  {{-- ── DOCUMENT TITLE ──────────────────────────── --}}
  <div class="doc-title">
    <h2>Daftar Hadir Siswa</h2>
  </div>

  {{-- ── INFO ROWS ──────────────────────────────── --}}
  <div class="info-grid">
    <span class="label">Jurusan</span>
    <span class="sep">:</span>
    <span class="value">{{ ucwords($jurusan) }}</span>

    <span class="label">Kelas</span>
    <span class="sep">:</span>
    <span class="value">{{ $kelas }}</span>

    <span class="label">Mata Pelajaran</span>
    <span class="sep">:</span>
    <span class="value">
      <span class="mapel-value">
        @if($mapel)
          {{ $mapel }}
        @else
          <span class="mapel-dots">&nbsp;</span>
        @endif
      </span>
    </span>

    <span class="label">Tanggal</span>
    <span class="sep">:</span>
    <span class="value"><span style="border-bottom:1px solid #000;display:inline-block;min-width:180px;">&nbsp;</span></span>

    <span class="label">Pertemuan ke-</span>
    <span class="sep">:</span>
    <span class="value"><span style="border-bottom:1px solid #000;display:inline-block;min-width:60px;">&nbsp;</span></span>
  </div>

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

  {{-- ── SIGNATURE ──────────────────────────────── --}}
  <div class="sign-area">
    <div class="sign-block">
      <div>Guru Mata Pelajaran,</div>
      <div class="sign-line">
        <span style="font-style:italic;">(.................................)</span>
      </div>
    </div>
  </div>

  {{-- Auto-print when opened --}}
  <script>
    window.onload = function () {
      window.print();
    };
  </script>
</body>
</html>
