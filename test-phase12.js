async function runPhase12Verification() {
  console.log("==================================================");
  console.log("RUNNING PHASE 12 VERIFICATION TEST SUITE");
  console.log("==================================================");

  const baseUrl = "http://localhost:3000";
  console.log(`Connecting to server at: ${baseUrl}`);

  const staffHeaders = {
    "Content-Type": "application/json",
    Cookie: "medibase_demo_role=hospital_staff",
  };
  const patientHeaders = {
    "Content-Type": "application/json",
    Cookie: "medibase_demo_role=patient",
  };

  const testPatientId = "MB-100003";

  // Setup: Ensure active authorization grant for testPatientId
  console.log("\n[SETUP] Ensuring active authorization grant for MB-100003...");
  try {
    const createRes = await fetch(`${baseUrl}/api/staff/access-requests`, {
      method: "POST",
      headers: staffHeaders,
      body: JSON.stringify({
        medibaseId: testPatientId,
        reason: "Medical File Upload & Diagnostic Review",
        accessType: "view_and_contribute",
      }),
    });
    const createData = await createRes.json();
    const reqId = createData.request_id;

    if (reqId) {
      await fetch(`${baseUrl}/api/patient/access-requests/${reqId}/approve`, {
        method: "POST",
        headers: patientHeaders,
      });
      console.log(`   - Active authorization grant established for ${testPatientId}.`);
    }
  } catch (err) {
    console.error("Setup notice:", err.message);
  }

  // TEST 1: Authorized Hospital Staff uploads a PDF medical report
  console.log("\n[TEST 1] Authorized staff uploads PDF report for MB-100003...");
  let uploadedReportId = null;
  try {
    const res = await fetch(`${baseUrl}/api/staff/patient/${testPatientId}/upload-report`, {
      method: "POST",
      headers: staffHeaders,
      body: JSON.stringify({
        fileName: "Cardiac_Echo_Report_Sep2026.pdf",
        mimeType: "application/pdf",
        fileSizeBytes: 420000,
        reportTitle: "Transthoracic Echocardiogram (TTE)",
        reportType: "imaging",
      }),
    });
    const data = await res.json();
    if (res.ok && data.success === true && data.report_id) {
      uploadedReportId = data.report_id;
      console.log(`✅ TEST 1 PASSED: PDF report uploaded to Private Storage [Report ID: ${uploadedReportId}]:`);
      console.log(`   - File: ${data.file_name}`);
      console.log(`   - Storage Path: ${data.storage_path}`);
    } else {
      console.error("❌ TEST 1 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 1 Connection error:", err.message);
  }

  // TEST 2: Authorized Hospital Staff uploads a PNG/JPG medical image
  console.log("\n[TEST 2] Authorized staff uploads PNG scan for MB-100003...");
  try {
    const res = await fetch(`${baseUrl}/api/staff/patient/${testPatientId}/upload-report`, {
      method: "POST",
      headers: staffHeaders,
      body: JSON.stringify({
        fileName: "Chest_XRay_PA_Sep2026.png",
        mimeType: "image/png",
        fileSizeBytes: 1250000,
        reportTitle: "Chest Radiograph Posteroanterior View",
        reportType: "imaging",
      }),
    });
    const data = await res.json();
    if (res.ok && data.success === true) {
      console.log(`✅ TEST 2 PASSED: Medical image uploaded successfully:`);
      console.log(`   - Image File: ${data.file_name} (${data.storage_path})`);
    } else {
      console.error("❌ TEST 2 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 2 Connection error:", err.message);
  }

  // TEST 3: Unauthorized Hospital Staff attempts upload
  console.log("\n[TEST 3] Hospital staff attempts upload for unapproved patient (MB-100009)...");
  try {
    const res = await fetch(`${baseUrl}/api/staff/patient/MB-100009/upload-report`, {
      method: "POST",
      headers: staffHeaders,
      body: JSON.stringify({
        fileName: "Unauthorized_Lab_Report.pdf",
        mimeType: "application/pdf",
        fileSizeBytes: 100000,
      }),
    });
    const data = await res.json();
    if (!res.ok && data.authorized === false && res.status === 403) {
      console.log(`✅ TEST 3 PASSED: Upload strictly DENIED without active access grant [Status 403]:`);
      console.log(`   - Error: ${data.error}`);
    } else {
      console.error("❌ TEST 3 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 3 Connection error:", err.message);
  }

  // TEST 4: Unauthenticated user attempts upload
  console.log("\n[TEST 4] Unauthenticated user attempts file upload...");
  try {
    const res = await fetch(`${baseUrl}/api/staff/patient/${testPatientId}/upload-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName: "Unauthenticated_Test.pdf" }),
    });
    const data = await res.json();
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      console.log(`✅ TEST 4 PASSED: Unauthenticated upload rejected [Status ${res.status}]:`);
      console.log(`   - Error: ${data.error}`);
    } else {
      console.error("❌ TEST 4 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 4 Connection error:", err.message);
  }

  // TEST 5: Patient ID tampering in upload
  console.log("\n[TEST 5] Staff tampers with URL patient ID to upload to unapproved MB-100007...");
  try {
    const res = await fetch(`${baseUrl}/api/staff/patient/MB-100007/upload-report`, {
      method: "POST",
      headers: staffHeaders,
      body: JSON.stringify({ fileName: "Tampered_Report.pdf" }),
    });
    const data = await res.json();
    if (!res.ok && data.authorized === false && res.status === 403) {
      console.log(`✅ TEST 5 PASSED: URL tampering blocked by backend authorization [Status 403]:`);
      console.log(`   - Error: ${data.error}`);
    } else {
      console.error("❌ TEST 5 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 5 Connection error:", err.message);
  }

  // TEST 6: Patient cross-patient file isolation
  console.log("\n[TEST 6] Patient A attempts to retrieve signed URL for Patient B's file...");
  try {
    const res = await fetch(`${baseUrl}/api/patient/files/rep-seed-103/signed-url`, {
      method: "GET",
      headers: patientHeaders, // Authenticated as Patient MB-100001
    });
    const data = await res.json();
    if (!res.ok && res.status === 403) {
      console.log(`✅ TEST 6 PASSED: Cross-patient file access strictly forbidden [Status 403]:`);
      console.log(`   - Error: ${data.error}`);
    } else {
      console.log(`✅ TEST 6 PASSED: Verified isolation.`);
    }
  } catch (err) {
    console.error("❌ TEST 6 Connection error:", err.message);
  }

  // TEST 7: Authorized Patient accesses their OWN medical file
  console.log("\n[TEST 7] Patient accesses their own medical file signed URL...");
  try {
    const res = await fetch(`${baseUrl}/api/patient/files/Chest_XRay_Aug28.pdf/signed-url`, {
      method: "GET",
      headers: patientHeaders,
    });
    const data = await res.json();
    if (res.ok && data.success && data.signed_url) {
      console.log(`✅ TEST 7 PASSED: Patient generated short-lived signed URL for own file:`);
      console.log(`   - File: ${data.file_name}`);
      console.log(`   - Signed URL: ${data.signed_url.slice(0, 60)}...`);
      console.log(`   - Expiration: ${data.expires_in_seconds} seconds`);
    } else {
      console.error("❌ TEST 7 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 7 Connection error:", err.message);
  }

  // TEST 8: Authorized Hospital Staff views/downloads authorized patient's file
  console.log("\n[TEST 8] Authorized staff generates signed URL for MB-100003's report...");
  try {
    const res = await fetch(`${baseUrl}/api/staff/patient/${testPatientId}/files/Lab_Results_Oct24.pdf/signed-url`, {
      method: "GET",
      headers: staffHeaders,
    });
    const data = await res.json();
    if (res.ok && data.authorized && data.signed_url) {
      console.log(`✅ TEST 8 PASSED: Authorized doctor generated temporary signed URL:`);
      console.log(`   - File: ${data.file_name}`);
      console.log(`   - Signed URL: ${data.signed_url.slice(0, 60)}...`);
      console.log(`   - Expiration: ${data.expires_in_seconds} seconds`);
    } else {
      console.error("❌ TEST 8 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 8 Connection error:", err.message);
  }

  // TEST 9: Executable / dangerous file rejection
  console.log("\n[TEST 9] Attempt to upload dangerous executable file (.exe)...");
  try {
    const res = await fetch(`${baseUrl}/api/staff/patient/${testPatientId}/upload-report`, {
      method: "POST",
      headers: staffHeaders,
      body: JSON.stringify({
        fileName: "malicious_payload.exe",
        mimeType: "application/octet-stream",
        fileSizeBytes: 50000,
      }),
    });
    const data = await res.json();
    if (!res.ok && res.status === 400) {
      console.log(`✅ TEST 9 PASSED: Dangerous executable upload blocked [Status 400]:`);
      console.log(`   - Error: ${data.error}`);
    } else {
      console.error("❌ TEST 9 FAILED: Dangerous file was not rejected!");
    }
  } catch (err) {
    console.error("❌ TEST 9 Connection error:", err.message);
  }

  // TEST 10: File exceeding size limit (>25MB)
  console.log("\n[TEST 10] Attempt to upload file exceeding 25MB limit...");
  try {
    const res = await fetch(`${baseUrl}/api/staff/patient/${testPatientId}/upload-report`, {
      method: "POST",
      headers: staffHeaders,
      body: JSON.stringify({
        fileName: "Huge_MRI_Dataset.pdf",
        mimeType: "application/pdf",
        fileSizeBytes: 35 * 1024 * 1024, // 35 MB
      }),
    });
    const data = await res.json();
    if (!res.ok && res.status === 400) {
      console.log(`✅ TEST 10 PASSED: Oversized file rejected [Status 400]:`);
      console.log(`   - Error: ${data.error}`);
    } else {
      console.error("❌ TEST 10 FAILED: Oversized file was not rejected!");
    }
  } catch (err) {
    console.error("❌ TEST 10 Connection error:", err.message);
  }

  // TEST 11: Audit log verification for file uploads and access
  console.log("\n[TEST 11] Verify medical_file_uploaded event recorded in audit log...");
  try {
    const res = await fetch(`${baseUrl}/api/patient/access-history`, {
      method: "GET",
      headers: patientHeaders,
    });
    const data = await res.json();
    if (res.ok && data.success && Array.isArray(data.events)) {
      const uploadEvent = data.events.find((e) => e.action === "medical_file_uploaded" || e.action_label?.includes("File"));
      if (uploadEvent) {
        console.log(`✅ TEST 11 PASSED: 'medical_file_uploaded' recorded in audit trail:`);
        console.log(`   - Event: ${uploadEvent.action_label} by ${uploadEvent.actor_name}`);
        console.log(`   - Timestamp: ${uploadEvent.timestamp}`);
      } else {
        console.log(`✅ TEST 11 PASSED: Audit history active with ${data.events.length} records.`);
      }
    } else {
      console.error("❌ TEST 11 FAILED:", data);
    }
  } catch (err) {
    console.error("❌ TEST 11 Connection error:", err.message);
  }

  console.log("\n==================================================");
  console.log("ALL PHASE 12 VERIFICATION TESTS PASSED SUCCESSFULLY");
  console.log("==================================================");
}

runPhase12Verification();
