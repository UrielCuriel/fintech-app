
export async function POST(
  req: Request
) {
  try {
    // Leer el cuerpo de la solicitud que contiene el reporte CSP
    const body = await req.json();
    const report = body['csp-report'];

    console.error('CSP Violation Report:', report);

    // Aquí podrías almacenar el reporte en una base de datos para análisis posterior
    // await saveReportToDatabase(report);

    return new Response(null, {
      status: 204, // No Content
    });
  } catch (error) {
    console.error('Error processing CSP report:', error);
    return new Response(null, {
      status: 500, // Internal Server Error
    });
  }
}

