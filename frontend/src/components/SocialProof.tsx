const SocialProof = () => {
  const logos = [
    {
      name: "Transistor",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuATtvL3zPnxZkc0qPAoetPiY2iVjr-79gM6quLKMNzogCjPC-FQBgUjh-Hv1ytIoEApV-ADznYlOJAYov1rRYidJ6QbcsK4riECQXyMqzQi44xduZvmuS0_0wyXL8JbufLlINBgYkgEoREPnV0vOkwRME_TDzcJWpKVhep4vAsNYVIh-JPO5-laT3YdDWtt9lUclqj5poJuQGPnJQCuMOr54bgBs1yi1YlaLG6P8UkOXZEZT7es_qAt48bkmg4Fp-jFiEpbivYhpw"
    },
    {
      name: "Reform",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbl4TfsKWwHG65fj7xDtVMq0QB3nGCzfRespehbbYpX96sHPZu8qGudQprbE6Rtwp8DXGvRZHR_pNNgFR1BPo0lEmLA9JskovBMqO7onkc0I_W0m9LO6Dze1Pv4UJwhlTN0xOK889SjvDUr2p3YVfIxieO6zDb9WU_5v818v0Wfph2fyBd2mMe1cnVNHanGEtmFhMrwSEMKCM0W8xzUgjJtK-5tsw561Aw39ma3W6tGUGgMrGpWU11GvbGk985Glj_jUfWOw-qOg"
    },
    {
      name: "Tuple",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8vF9Bgwy-SHZnWO5IXBlLeBjeGK7cD77huMc1HMzaoW8Gr3pMajaIkKk8NM348S_cfPAYjq5_POMiXhYdb-lVCukH-Gyr8d0XtMqO9W6I_S1KfnQpQC6UT44j-nhAnqGJBkV_3F3UXX7SZaJvpH8xEo17Occ9XpoY1O8ba8TNZPrrPLkFUxzlTTx5n49sBGykDXfbc9YjjBJJRRlnvY6ZlFgzVxzIE2btQA1s4Tb0kf3ZL02TecLz-KpROQE9lA-S13W8hLYsMg"
    },
    {
      name: "SavvyCal",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCplCVV30e5mc6tUIw_0H4cFJhjVehbik9CMsJxSWAwiCiX199YDi6ZDLQiAEx_dzFPyt9zSnMHCLAUUnZ5K-Qvs86oEjPoWW357o6ObEHihqwXOur18dS-_QrJUkOaDSjCCRlyO931G6PZu4Z4djA3uWJHOEerSbdPvSxD7sZAOze2U7Lsz2MAu7LvfcvgL_xJmrb4vtBBi_tDgHO1TRcRnKuZIA9KrAiB5X_cxZ3NX0z1icIYTQPf9muP4yaOZSUwVi6F4MU-3A"
    },
    {
      name: "Statamic",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXkKWY6VPcr_7h0okdHhXOJWOfoLba08CJc1HGwUHRrCgjXq7m-tydevmNvjnI6AMtB_vasLQ_7Ab8h9vrNVUZCda18xIuBCz2C3bMQXoqGHRU-4NJMpm7lRC4S64mHlnMSxiJEUE2dRccm-Lz_EH3fEvUFO864xnybvoutHUqqntA8x5wwfX1gAWd8aiEXNTpAef4KP0g3gqJrAqui9v4Uo4WydmYolkpFQXClg94UHpXmxFPpCuHFHnF4o0SSdmWx0K3LPo7FA"
    },
    {
      name: "Laravel",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkkOhLhHaGv6wH0guPT_2sSgrqGudi4b5qwnUWNsA9mHBZg0SLBtfrxsaXyWEOIpVRHYD1SyTjCtu_H6QybGTDSdRCHsZr8V6qwIlo13HFbi-LSi1PErgE4MXtmCHwhPvO5Eahw0iYEElivPluIJ2Rs9yY038qEas0Cn8418r8BKL1Bbt3S6i4Xq5btIXz7I79VeIAmOwrKyBPM7taufEWOQHV7J9CBhSXGAxHysF5hXpoYlX-_eHzp1QnUIBJA77nUc0i6DYSmQ"
    }
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h4 className="text-center text-sm font-bold uppercase tracking-widest text-[#616f89] dark:text-gray-500">
          Trusted by top teams
        </h4>
        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6 items-center justify-items-center">
          {logos.map((logo) => (
            <img
              key={logo.name}
              className="col-span-1 max-h-12 w-full object-contain rounded-full"
              alt={`${logo.name} logo`}
              src={logo.src}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
